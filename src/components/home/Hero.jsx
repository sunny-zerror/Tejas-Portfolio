"use client"
import React, { useEffect, useRef, useState } from 'react'
import InfiniteMarquee from '../effects/InfiniteMarquee'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { useRouter } from 'next/navigation'
import { ProjectsData } from '@/utils/projectsData'
import { sound } from '@/utils/sound'
import TrackBar from '../effects/TrackBar'

gsap.registerPlugin(Flip);

const bar_data = [
    { id: 1, label: "January" },
    { id: 2, label: "February" },
    { id: 3, label: "March" },
    { id: 4, label: "April" },
    { id: 5, label: "May" },
    { id: 6, label: "June" },
    { id: 7, label: "July" },
    { id: 8, label: "August" },
    { id: 9, label: "September" },
    { id: 10, label: "October" },
    { id: 11, label: "November" },
    { id: 12, label: "December" },
]

const Hero = () => {
    const [marqueeProgress, setMarqueeProgress] = useState(0);
    const ticksRef = useRef([]);
    ticksRef.current = [];

    const router = useRouter();
    const isAnimating = { current: false };

    const handleClick = (project, e) => {
        if (isAnimating.current) return;
        sound.play("click")
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

    return (
        <>
            <div className="w-full h-screen relative flex items-center">
                <InfiniteMarquee onUpdate={setMarqueeProgress}>
                    <div className=" marque_paren  w-full h-screen flex items-center select-none">
                        {ProjectsData.map((project) => (
                            <div
                                onClick={(e) => handleClick(project, e)}
                                data-flip-id={`box-${project.id}`}
                                key={project.id}
                                onDragStart={(e) => e.preventDefault()}
                                className=" translate-y-14 opacity-0 marquee-card group cursor-pointer select-none group w-[18.5vw] ml-5 transform-3d perspective-distant   relative">
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

                <div className="track_bar_parent fixed bottom-12 left-0 w-full">
                    <TrackBar progress={marqueeProgress} />
                </div>
                <div className="track_bar_parent fixed bottom-5 pointer-events-none left-0 w-full">
                    <InfiniteMarquee>
                        {bar_data.map((month, index) => (
                            <div key={index} className="w-[40vw]">
                                <p className="month uppercase text-sm pp_mono">{month.label}</p>
                            </div>
                        ))}
                    </InfiniteMarquee>
                </div>
            </div>
        </>
    )
}

export default Hero