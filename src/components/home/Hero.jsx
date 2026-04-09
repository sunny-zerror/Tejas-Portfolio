"use client"
import React from 'react'
import InfiniteMarquee from '../effects/InfiniteMarquee'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { useRouter } from 'next/navigation'
import { ProjectsData } from '@/utils/projectsData'

gsap.registerPlugin(Flip);

const Hero = () => {

    const router = useRouter();
    const isAnimating = { current: false };

    const handleClick = (project, e) => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        const el = e.currentTarget;

        // store Flip state
        flipState.element = el;
        flipState.state = Flip.getState(el);

        const allCards = document.querySelectorAll(".marquee-card");

        const otherCards = Array.from(allCards).filter(card => card !== el);

        const tl = gsap.timeline({
            onComplete: () => {
                router.push(`/project/${project.slug}`);
            }
        });

        tl.to([otherCards, ".hero_title"], {
            opacity: 0,
            duration: 0.4,
            ease: "expo.out",
        });

    };

    useGSAP(() => {
        gsap.to(".marque_paren", {
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            delay: 0.2
        })
    })

    return (
        <>
            <div className="w-full h-screen relative flex items-center">
                <div className=" hero_title absolute top-10 z-10 mix-blend-difference left-1/2 -translate-x-1/2 text-center text-7xl bold">
                    <h1 className=' text-white'>Better Of <br /> THE LOOKBACK <br />2026</h1>
                </div>

                <InfiniteMarquee>
                    <div className=" marque_paren opacity-0 w-full flex items-center select-none">
                        {ProjectsData.map((project) => (
                            <div
                                onClick={(e) => handleClick(project, e)}
                                data-flip-id={`box-${project.id}`}
                                key={project.id}
                                onDragStart={(e) => e.preventDefault()}
                                className=" marquee-card group cursor-pointer select-none group w-[20vw] ml-5 transform-3d perspective-distant   relative">
                                <div className="w-full inline-block overflow-hidden">
                                    <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
                                </div>
                                <div className="img_card w-full">
                                    <img
                                        src={project.img}
                                        alt=""
                                        draggable={false}
                                        className="select-none " />
                                </div>
                                <div className="w-full mt-2 inline-block overflow-hidden">
                                    <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </InfiniteMarquee>
            </div>
        </>
    )
}

export default Hero