"use client";

import { useEffect, useRef, useState } from "react";

export default function InfiniteMarquee({
    children,
    speed = 60,
    draggable = true,
    className = "",
    ariaLabel = "Auto-scrolling marquee",
}) {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const isTouchRef = useRef(false);
    const hasIntroPlayed = useRef(false);

    const [contentWidth, setContentWidth] = useState(0);

    const velocity = useRef(0);
    const position = useRef(0);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const lastScrollY = useRef(0);
    const dragDistance = useRef(0);
    const pointerDownTarget = useRef(null);

    const rotation = useRef(0);
    const targetRotation = useRef(0);

    useEffect(() => {
        if (!trackRef.current) return;

        const el = trackRef.current;

        const observer = new ResizeObserver(() => {
            setContentWidth(el.scrollWidth / 2);
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!contentWidth || hasIntroPlayed.current) return;

        hasIntroPlayed.current = true;

        let start = null;
        const duration = 1500;
        const distance = -5000;
        const startPosition = position.current;
        let raf;

        const animateIntro = (time) => {
            if (!start) start = time;

            const progress = Math.min((time - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            position.current = startPosition + distance * ease;

            if (progress < 1) {
                raf = requestAnimationFrame(animateIntro);
            } else {
                velocity.current = 0;
            }
        };

        raf = requestAnimationFrame(animateIntro);
        return () => cancelAnimationFrame(raf);
    }, [contentWidth]);

    useEffect(() => {
        if (!contentWidth) return;

        let raf;
        let lastTime = performance.now();

        const animate = (time) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            position.current += velocity.current;
            velocity.current *= isTouchRef.current ? 0.92 : 0.95;

            if (Math.abs(velocity.current) < 0.01) {
                velocity.current = 0;
            }

            if (position.current <= -contentWidth) {
                position.current += contentWidth;
            } else if (position.current >= 0) {
                position.current -= contentWidth;
            }

            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(${position.current}px)`;

                targetRotation.current = Math.max(
                    Math.min(velocity.current * 0.6, 50),
                    -50
                );
                rotation.current += (targetRotation.current - rotation.current) * Math.min(delta * 10, 1);

                const cards = trackRef.current.querySelectorAll(".img_card");
                cards.forEach((card) => {
                    card.style.transform = `rotateY(${rotation.current}deg)`;
                });
            }

            raf = requestAnimationFrame(animate);
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
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
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;

            applyScrollDelta(delta);
            lastScrollY.current = currentScrollY;
        };

        const onWheel = (e) => {
            const primaryDelta =
                Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

            applyScrollDelta(primaryDelta);
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

        const onPointerDown = (e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;

            isDragging.current = true;
            lastX.current = e.clientX;
            dragDistance.current = 0;
            pointerDownTarget.current = e.target;
            isTouchRef.current = e.pointerType === "touch";

            el.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!isDragging.current) return;

            const delta = e.clientX - lastX.current;
            dragDistance.current += Math.abs(delta);

            const multiplier = isTouchRef.current ? 3 : 1;
            velocity.current = delta * multiplier;

            lastX.current = e.clientX;
        };

        const stopDrag = (e) => {
            const shouldTriggerClick = dragDistance.current < 6;

            isDragging.current = false;
            dragDistance.current = 0;

            try {
                el.releasePointerCapture(e.pointerId);
            } catch { }

            if (
                shouldTriggerClick &&
                pointerDownTarget.current instanceof HTMLElement &&
                pointerDownTarget.current !== el
            ) {
                pointerDownTarget.current.click();
            }

            pointerDownTarget.current = null;
        };

        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", stopDrag);
        window.addEventListener("pointercancel", stopDrag);
        window.addEventListener("pointerleave", stopDrag);

        return () => {
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", stopDrag);
            window.removeEventListener("pointercancel", stopDrag);
            window.removeEventListener("pointerleave", stopDrag);
        };
    }, [draggable]);

    useEffect(() => {
        if (!containerRef.current) return;

        const el = containerRef.current;

        const onWheelCapture = (e) => {
            if (Math.abs(e.deltaX) > 0) {
                e.preventDefault();
            }
        };

        el.addEventListener("wheel", onWheelCapture, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheelCapture);
        };
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
                className="inline-flex items-end select-none will-change-transform"
            >
                {children}
                {children}
            </div>

        </div>
    );
}
