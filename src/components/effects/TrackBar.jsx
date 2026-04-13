"use client";
import { sound } from "@/utils/sound";
import { useEffect, useRef } from "react";

const TrackBar = ({ progress = 0 }) => {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    const bars = useRef([]);
    const width = useRef(0);
    const height = useRef(0);
    const lastCenterIndex = useRef(null);
    const mouseX = useRef(-1);
    const isHover = useRef(false);

    const lastProgress = useRef(0);
    const velocity = useRef(0);

    const gap = 12;
    const baseHeight = 10;
    const maxCenterBoost = 40;
    const hoverBoost = 18;
    const near = 100;

    const lerp = (a, b, t) => a + (b - a) * t;

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx = canvas.getContext("2d");

        const resize = () => {
            width.current = wrapper.clientWidth;
            height.current = wrapper.clientHeight;

            canvas.width = width.current * devicePixelRatio;
            canvas.height = height.current * devicePixelRatio;

            canvas.style.width = width.current + "px";
            canvas.style.height = height.current + "px";

            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

            bars.current = new Float32Array(
                Math.ceil(width.current / gap) + 10
            );
        };

        resize();
        window.addEventListener("resize", resize);

        const onEnter = () => (isHover.current = true);
        const onLeave = () => {
            isHover.current = false;
            mouseX.current = -1;
        };
        const onMove = (e) => {
            const rect = wrapper.getBoundingClientRect();
            mouseX.current = e.clientX - rect.left;
        };

        wrapper.addEventListener("mouseenter", onEnter);
        wrapper.addEventListener("mouseleave", onLeave);
        wrapper.addEventListener("mousemove", onMove);

        let raf;

        const draw = () => {
            ctx.clearRect(0, 0, width.current, height.current);

            velocity.current = progress - lastProgress.current;
            lastProgress.current = progress;

            const isMoving = Math.abs(velocity.current) > 0.01;

            const centerX = width.current / 2;
            const offset = progress % gap;

            const baseIndex = Math.floor(progress / gap);
            const centerFloat = (progress + centerX) / gap;
            const centerIndex = Math.round(centerFloat);

            if (lastCenterIndex.current !== null && centerIndex !== lastCenterIndex.current) {
                sound.play("fx");
            }

            lastCenterIndex.current = centerIndex;

            for (let i = 0; i < bars.current.length; i++) {
                const x = i * gap - offset;
                const index = baseIndex + i;

                let target = 0;

                if (isMoving) {
                    const dist = Math.abs(index - centerFloat);

                    if (dist < 2) {
                        const t = 1 - dist / 2;

                        const curveBoost = maxCenterBoost * 8;

                        target = curveBoost * Math.pow(t, 2.2);
                    }
                } else {
                    if (index === centerIndex) {
                        target = maxCenterBoost;
                    }
                }

                if (isHover.current && mouseX.current >= 0) {
                    const d = Math.abs(x - mouseX.current);
                    if (d < near) {
                        const t = 1 - d / near;
                        target += hoverBoost * Math.pow(t, 1.6);
                    }
                }

                bars.current[i] = lerp(bars.current[i], target, 0.12);

                const h = baseHeight + bars.current[i];

                ctx.beginPath();
                ctx.moveTo(x + 0.5, height.current);
                ctx.lineTo(x + 0.5, height.current - h);

                ctx.strokeStyle = "#000";

                ctx.globalAlpha = 0.2 + Math.min(1, bars.current[i] / maxCenterBoost) * 0.75;

                ctx.lineWidth = 1;
                ctx.stroke();
            }

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            wrapper.removeEventListener("mouseenter", onEnter);
            wrapper.removeEventListener("mouseleave", onLeave);
            wrapper.removeEventListener("mousemove", onMove);
        };
    }, [progress]);

    return (
        <div ref={wrapperRef} className="w-full h-[80px] relative">
            <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
    );
};

export default TrackBar;