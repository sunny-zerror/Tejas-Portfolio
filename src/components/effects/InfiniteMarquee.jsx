"use client";
import { useEffect, useRef, useState } from "react";

const lerp = (a, b, t) => a + (b - a) * t;

export default function InfiniteMarquee({
    children,
    onUpdate,
    speed = 60,
    draggable = true,
    className = "",
    ariaLabel = "Auto-scrolling marquee",
}) {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const smoothVelocity = useRef(0);
    const [contentWidth, setContentWidth] = useState(0);

    const velocity = useRef(0);
    const position = useRef(0);

    const isDragging = useRef(false);
    const lastX = useRef(0);
    const dragDistance = useRef(0);

    const lastScrollY = useRef(0);
    const isTouchRef = useRef(false);

    const rotation = useRef(0);
    const targetRotation = useRef(0);

    const isReady = useRef(false);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!trackRef.current) return;

        const el = trackRef.current;

        const measure = () => {
            const width = el.scrollWidth / 2;

            setContentWidth((prev) => {
                if (Math.abs(prev - width) < 1) return prev;
                return width;
            });
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!contentWidth) return;
        position.current = -contentWidth / 2;
    }, [contentWidth]);

    useEffect(() => {
        if (!contentWidth) return;

        const t = setTimeout(() => {
            isReady.current = true;
        }, 50);

        return () => clearTimeout(t);
    }, [contentWidth]);

    useEffect(() => {
        if (!contentWidth) return;

        let lastTime = performance.now();

        const animate = (time) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            if (!isReady.current) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            smoothVelocity.current = lerp(
                smoothVelocity.current,
                velocity.current,
                isDragging.current ? 0.35 : 0.08
            );

            position.current += smoothVelocity.current;

            const friction = isDragging.current ? 0.85 : 0.92;
            velocity.current *= friction;

            if (Math.abs(velocity.current) < 0.01) velocity.current = 0;

            if (position.current <= -contentWidth) {
                position.current += contentWidth;
            } else if (position.current >= 0) {
                position.current -= contentWidth;
            }

            if (trackRef.current) {
                trackRef.current.style.transform =
                    `translate3d(${position.current}px,0,0)`;

                targetRotation.current = Math.max(
                    Math.min(velocity.current, 80),
                    -80
                );

                rotation.current +=
                    (targetRotation.current - rotation.current) *
                    Math.min(delta * 10, 1);

                const cards =
                    trackRef.current.querySelectorAll(".img_card");

                cards.forEach((card) => {
                    card.style.transform =
                        `rotateY(${rotation.current}deg)`;
                });
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafRef.current);
    }, [contentWidth]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        lastScrollY.current = window.scrollY;

        const applyScrollDelta = (delta) => {
            if (delta !== 0) {
                velocity.current -= delta * (speed / 1500);
            }
        };

        const onScroll = () => {
            const current = window.scrollY;
            const delta = current - lastScrollY.current;

            applyScrollDelta(delta);
            lastScrollY.current = current;
        };

        const onWheel = (e) => {
            const primary =
                Math.abs(e.deltaY) >= Math.abs(e.deltaX)
                    ? e.deltaY
                    : e.deltaX;

            applyScrollDelta(primary);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("wheel", onWheel, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("wheel", onWheel);
        };
    }, [speed]);

    useEffect(() => {
        if (!draggable || !containerRef.current) return;

        const el = containerRef.current;
        let pointerDownTarget = null;

        const onPointerDown = (e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;

            isDragging.current = true;
            lastX.current = e.clientX;
            dragDistance.current = 0;
            isTouchRef.current = e.pointerType === "touch";

            pointerDownTarget = e.target;

            el.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!isDragging.current) return;

            const rawDelta = e.clientX - lastX.current;
            dragDistance.current += Math.abs(rawDelta);

            const boostedDelta =
                Math.sign(rawDelta) *
                Math.pow(Math.abs(rawDelta), 1.1) *
                (isTouchRef.current ? 1.5 : .8);

            velocity.current += boostedDelta * 0.5;

            lastX.current = e.clientX;
        };

        const onPointerUp = (e) => {
            const isClick = dragDistance.current < 6;

            isDragging.current = false;

            velocity.current *= isTouchRef.current ? 1.5 : 1.3;

            try {
                el.releasePointerCapture(e.pointerId);
            } catch { }

            if (
                isClick &&
                pointerDownTarget &&
                pointerDownTarget instanceof HTMLElement &&
                pointerDownTarget !== el
            ) {
                pointerDownTarget.click();
            }

            pointerDownTarget = null;
        };

        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);

        return () => {
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
        };
    }, [draggable]);

    useEffect(() => {
        if (!trackRef.current) return;

        const interval = setInterval(() => {
            if (onUpdate) {
                onUpdate(-position.current);
            }
        }, 16);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            role="marquee"
            aria-live="off"
            aria-label={ariaLabel}
            style={{ touchAction: "pan-y" }}
            className={`w-full overflow-x-clip marquee-no-select ${className}`}
        >
            <div
                ref={trackRef}
                className="inline-flex items-end will-change-transform"
            >
                {children}
                {children}
            </div>
        </div>
    );
}