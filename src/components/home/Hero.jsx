"use client"
import React, { useEffect, useRef } from 'react'
import InfiniteMarquee from '../effects/InfiniteMarquee'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { useRouter } from 'next/navigation'
import { ProjectsData } from '@/utils/projectsData'
import { sound } from '@/utils/sound'

gsap.registerPlugin(Flip);

const Hero = () => {

    const ticksRef = useRef([]);
    ticksRef.current = [];

    const router = useRouter();
    const isAnimating = { current: false };

    const handleClick = (project, e) => {
        if (isAnimating.current) return;
        sound.playClick()
        isAnimating.current = true;

        const el = e.currentTarget;

        flipState.element = el;
        flipState.state = Flip.getState(el);
        flipState.fromSwiper = false;

        const allCards = document.querySelectorAll(".marquee-card");

        const otherCards = Array.from(allCards).filter(card => card !== el);

        const tl = gsap.timeline({
            onComplete: () => {
                router.push(`/project/${project.slug}`);
            }
        });

        tl.to([otherCards, ".hero_title"], {
            opacity: 0,
            duration: 0.1,
            ease: "expo.out",
        });
        tl.to(".proj_id", {
            y: 20,
            duration: 0.1,
        }, "<")
        tl.to(".proj_det", {
            y: -20,
            duration: 0.1,
        }, "<")

    };

    useGSAP(() => {
        gsap.to(".marque_paren", {
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            delay: 0.2
        })
    })

    useEffect(() => {
        const updateCenterTick = () => {
            const centerX = window.innerWidth / 2;

            ticksRef.current.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elCenter = rect.left + rect.width / 2;

                const isCenter = Math.abs(elCenter - centerX) < 5;

                if (isCenter) {
                    el.classList.add("active_bar");
                } else {
                    el.classList.remove("active_bar");
                }
            });
        };

        let raf;
        const loop = () => {
            updateCenterTick();
            raf = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <>
            <div className="w-full h-screen relative flex items-center">
                <div className=" hero_title absolute top-5 z-10 mix-blend-difference left-1/2 -translate-x-1/2 text-center text-[4.6rem] bold">
                    <h1 className=' text-white leading-16'>Better Off® <br /> THE LOOKBACK <br />(BO®S/2026)</h1>
                </div>

                <InfiniteMarquee>
                    <div className=" marque_paren opacity-0 w-full h-screen flex items-center select-none">
                        {ProjectsData.map((project) => (
                            <div
                                onClick={(e) => handleClick(project, e)}
                                data-flip-id={`box-${project.id}`}
                                key={project.id}
                                onDragStart={(e) => e.preventDefault()}
                                className=" marquee-card group cursor-pointer select-none group w-[18.5vw] ml-5 transform-3d perspective-distant   relative">
                                <div className="w-full inline-block overflow-hidden">
                                    <p className={` proj_id group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
                                </div>
                                <div className="img_card w-full">
                                    {project.img ? (
                                        <img
                                            src={project.img}
                                            alt=""
                                            draggable={false}
                                            className="select-none " />
                                    ) : (
                                        <video src={project.vid} loop muted playsInline autoPlay></video>
                                    )}
                                </div>
                                <div className="w-full mt-2 inline-block overflow-hidden">
                                    <p className={` proj_det group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </InfiniteMarquee>

                <div className="fixed bottom-10 left-0 pointer-events-none w-full">
                    <InfiniteMarquee>
                        {[...Array(200)].map((_, i) => (
                            <div
                                key={i}
                                ref={(el) => el && ticksRef.current.push(el)}
                                className="tick h-3 border-l ml-3 border-black/40 transition-all duration-200 ease-out"
                            />
                        ))}
                    </InfiniteMarquee>
                </div>
            </div>
        </>
    )
}

export default Hero