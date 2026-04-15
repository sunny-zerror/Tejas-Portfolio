"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { sound } from "@/utils/sound";
import { useAppStore } from "../store/useAppStore";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

const SticksCanvas = forwardRef(({
    lw = 1,
    gap = 10,
    mh = 15,
    mjh = 22,
    alpha = 0.25,
    by = null,
    hover = true,
    near = 10,
    boost = 18,
    fall = 0.55,
    ease = 0.1
}, ref) => {

    const isMusicPlaying = useAppStore((state) => state.isMusicPlaying);
    const hasUserInteracted = useRef(false);
    const canvasRef = useRef(null);
    const isDragging = useRef(false);

    const playFx = () => {
        sound.play("fx");
    };

    const state = useRef({
        playedIndex: null,
        ctx: null,
        dpr: 1,
        vw: 0,
        vh: 0,
        scrollOffset: 0,
        itemWidth: lw + gap,
        prevHeights: new Float32Array(0),
        specialIndices: new Uint8Array(0),
        maxIndexCount: 0,
        mouseHover: false,
        mouseX: -1,
        heights: new Float32Array(0),
        allocatedLength: 0,
        lastIndex: null,
    });


    const allocateHeights = (size) => {
        if (size <= state.current.allocatedLength) return;

        state.current.allocatedLength = size;
        state.current.heights = new Float32Array(size);
        state.current.prevHeights = new Float32Array(size); // 👈 add this
    };

    const shiftHeights = (newIndex) => {
        let { lastIndex, heights, allocatedLength } = state.current;
        if (lastIndex == null) {
            state.current.lastIndex = newIndex;
        } else if (newIndex !== lastIndex) {
            const diff = newIndex - lastIndex;
            if (Math.abs(diff) >= allocatedLength) {
                heights.fill(0, 0, allocatedLength);
            } else if (diff > 0) {
                heights.copyWithin(0, diff, allocatedLength);
                heights.fill(0, allocatedLength - diff, allocatedLength);
            } else {
                const absDiff = -diff;
                heights.copyWithin(absDiff, 0, allocatedLength + diff);
                heights.fill(0, 0, absDiff);
            }
            state.current.lastIndex = newIndex;
        }
    };

    const fallEase = (ratio) => {
        const power = 1 / Math.max(0.001, fall);
        const v = 1 - ratio;
        return v <= 0 ? 0 : Math.pow(v, power);
    };

    const drawLine = (x, h, y, opacity) => {
        const { ctx } = state.current;
        if (!ctx) return;
        ctx.globalAlpha = opacity;
        const px = Math.round(x) + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y - h);
        ctx.stroke();
    };

    const tick = ({ ratio = 1 } = {}) => {
        const s = state.current;
        if (!s.ctx || s.vw <= 0 || s.vh <= 0) return;

        s.ctx.clearRect(0, 0, s.vw, s.vh);

        let offsetMod = s.scrollOffset % s.itemWidth;
        if (offsetMod < 0) offsetMod += s.itemWidth;

        const startIndex = Math.floor((s.scrollOffset - offsetMod) / s.itemWidth);
        const baseY = by == null ? s.vh - 1 : by;
        const halfVw = s.vw * 0.5;
        const nearPx = near * s.itemWidth;
        const isHovering = hover && (s.mouseHover || isDragging.current) && s.mouseX >= 0;

        const requiredLength = Math.ceil(s.vw / s.itemWidth) + 4;
        if (requiredLength !== s.allocatedLength) {
            allocateHeights(requiredLength);
        }
        shiftHeights(startIndex);

        const smoothEase = ease * ratio;
        const immediateEase = 0.2 * ratio;
        const centerIndex = Math.round((s.scrollOffset + halfVw) / s.itemWidth);

        for (let x = -offsetMod, i = 0; x <= s.vw + s.itemWidth; x += s.itemWidth, i++) {
            const itemIndex = startIndex + i;
            let isSpecial = false;

            if (s.maxIndexCount > 0) {
                let wrappedIndex = itemIndex % s.maxIndexCount;
                if (wrappedIndex < 0) wrappedIndex += s.maxIndexCount;
                isSpecial = s.specialIndices[wrappedIndex] === 1;
            }

            const baseH = isSpecial ? mjh : mh;
            let targetH = 0;

            if (itemIndex === centerIndex) {
                targetH += 50 - baseH;
            } else if (isHovering) {
                const dist = Math.abs(x - s.mouseX);
                if (dist < nearPx) {
                    targetH = boost * fallEase(dist / nearPx);
                }
            }

            s.heights[i] = lerp(s.heights[i], targetH, itemIndex === centerIndex ? immediateEase : smoothEase);
            const finalH = baseH + s.heights[i];

            let finalAlpha = alpha;
            if (itemIndex === centerIndex) {
                const progress = Math.max(0, Math.min(1, (finalH - baseH) / Math.max(1, 50 - baseH)));
                finalAlpha = alpha + progress * (1 - alpha);
            }
            if (itemIndex === centerIndex) {
                const isMax = Math.abs(finalH - (baseH + (50 - baseH))) < 30;

                if (
                    (hasUserInteracted.current || isMusicPlaying) &&
                    isMax &&
                    s.playedIndex !== itemIndex
                ) {
                    playFx();
                    s.playedIndex = itemIndex;
                }
            }

            drawLine(x, finalH, baseY, finalAlpha);
        }
    };

    const resize = () => {
        if (!canvasRef.current) return;
        const c = canvasRef.current;

        const pw = c.parentElement.clientWidth;
        const ph = c.parentElement.clientHeight;

        state.current.vw = pw;
        state.current.vh = ph;
        state.current.dpr = Math.min(2, window.devicePixelRatio || 1);

        c.width = Math.floor(pw * state.current.dpr);
        c.height = Math.floor(ph * state.current.dpr);

        const ctx = c.getContext("2d");
        state.current.ctx = ctx;
        ctx.setTransform(state.current.dpr, 0, 0, state.current.dpr, 0, 0);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = lw;

        state.current.itemWidth = lw + gap;
        state.current.allocatedLength = 0;

        tick();
    };

    useImperativeHandle(ref, () => ({
        resize,
        tick,
        setScrollOffset: (offset) => { state.current.scrollOffset = offset; },
        setSpecialIndices: (arr) => {
            if (!arr || !arr.length) {
                state.current.specialIndices = new Uint8Array(0);
                state.current.maxIndexCount = 0;
                return;
            }
            if (arr instanceof Uint8Array) {
                state.current.specialIndices = arr;
            } else {
                const newArr = new Uint8Array(arr.length);
                for (let i = 0; i < arr.length; i++) {
                    newArr[i] = arr[i] ? 1 : 0;
                }
                state.current.specialIndices = newArr;
            }
            state.current.maxIndexCount = state.current.specialIndices.length;
        }
    }));

    useEffect(() => {
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [lw, gap]);

    useEffect(() => {
        let raf;

        const loop = () => {
            tick();
            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        const handlePointerUp = () => {
            isDragging.current = false;

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);

        return () => {
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };
    }, []);

    useEffect(() => {
        const handlePointerMove = (e) => {
            if (!isDragging.current) return;

            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            state.current.mouseX = e.clientX - rect.left;
        };

        window.addEventListener("pointermove", handlePointerMove);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, []);

    return (
        <div
            className="relative h-14  w-full"
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
                hasUserInteracted.current = true; // ✅ unlock sound

                isDragging.current = true;
                state.current.mouseHover = true;

                const rect = canvasRef.current.getBoundingClientRect();
                state.current.mouseX = e.clientX - rect.left;

                document.body.style.cursor = "grabbing";
                document.body.style.userSelect = "none";

                e.currentTarget.setPointerCapture(e.pointerId);
            }}

            onPointerMove={(e) => {
                const rect = canvasRef.current.getBoundingClientRect();
                state.current.mouseX = e.clientX - rect.left;
            }}

            onPointerCancel={() => {
                isDragging.current = false;

                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }}

            onPointerLeave={() => {
                if (!isDragging.current) {
                    document.body.style.cursor = "";
                }
            }}



            onMouseEnter={() => state.current.mouseHover = true}
            onMouseLeave={() => {
                if (!isDragging.current) {
                    state.current.mouseHover = false;
                    state.current.mouseX = -1;
                }
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>
    );
});

SticksCanvas.displayName = "SticksCanvas";

export default SticksCanvas;
