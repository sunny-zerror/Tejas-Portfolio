"use client";
import { useEffect } from "react";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";

gsap.registerPlugin(Flip);

export default function AboutPage() {

    useEffect(() => {
        if (!flipState.state) return;

        const el = document.querySelector('[data-flip-id="box"]');

        Flip.from(flipState.state, {
            targets: el,
            duration: 1,
            ease: "power3.inOut",
            absolute: true,
        });

        flipState.state = null;
    }, []);

    return (
        <div className="about_page_paren w-full flex h-screen">
            <div className="about_page_left w-1/2 h-full flex gap-x-5 justify-center items-center">
                <div data-flip-id="box" className="box2 aspect-square bg-yellow-400 size-44"></div>
            </div>
            <div className="about_page_right w-1/2 h-full "></div>
        </div>
    );
}