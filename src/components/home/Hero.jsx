"use client"
import React, { useEffect, useRef, useState } from 'react'
import InfiniteMarquee from '../effects/InfiniteMarquee'
import gsap from 'gsap'
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { useRouter } from 'next/navigation'
import { ProjectsData } from '@/utils/projectsData'
import { sound } from '@/utils/sound'
import TrackBar from '../effects/TrackBar'
import Image from 'next/image'
import { useAppStore } from '../store/useAppStore'
import { useGSAP } from '@gsap/react';

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
    const hasIntroLoaded = useAppStore((state) => state.hasIntroLoaded);
    const trackRef = useRef(null);
    const [marqueeProgress, setMarqueeProgress] = useState(0);
    const ticksRef = useRef([]);
    ticksRef.current = [];

    const router = useRouter();
    const isAnimating = useRef(false);

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

    useEffect(() => {
        if (!trackRef.current) return;

        trackRef.current.setScrollOffset(marqueeProgress);
        trackRef.current.tick();
    }, [marqueeProgress]);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1.25 });
        tl.to(".title_anim", {
            y: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1
        })
    })

    useEffect(() => {
        if (hasIntroLoaded) {
            const completeTl = gsap.timeline({ delay: .25 });
            completeTl.to(".hero_title", {
                transform: "translate(-50%,0%)",
                top: "1.5rem",
                duration: 1.5,
                ease: "expo.out"
            })
                .to(".marquee-card", {
                    y: 0,
                    opacity: 1,
                    ease: "power2.out",
                    duration: .8,
                    stagger: {
                        each: 0.05,
                        from: 7
                    }
                }, "<")
                .to(".track_bar_parent", {
                    opacity: 1,
                    stagger: 0.1,
                    pointerEvents: "auto"
                }, "<")
        }
    }, [hasIntroLoaded])


    return (
        <>
            <div className="w-full h-screen relative flex items-center">

                <div className={`hero_title fixed left-1/2 top-0 translate-y-[276px] -translate-x-1/2 z-10 mix-blend-difference pointer-events-none select-none w-[90em] text-center`}>

                    <h1 className="text-white bold block">
                        <span className='block overflow-hidden'>
                            <p className=' title_anim translate-y-[105%]'>
                                Better Off®
                            </p>
                        </span>
                        <span className='block overflow-hidden'>
                            <p className=' title_anim translate-y-[105%]'>
                                THE LOOKBACK
                            </p>
                        </span>
                        <span className='block overflow-hidden'>
                            <p className=' title_anim translate-y-[105%]'>
                                (BO®S/2026)
                            </p>
                        </span>
                    </h1>

                </div>

                {hasIntroLoaded && (
                    <>
                        <InfiniteMarquee onUpdate={setMarqueeProgress}>
                            <div className=" marque_paren  w-full h-screen flex items-center select-none">
                                {ProjectsData.map((project) => (
                                    <div
                                        onClick={(e) => handleClick(project, e)}
                                        data-flip-id={`box-${project.id}`}
                                        key={project.id}
                                        onDragStart={(e) => e.preventDefault()}
                                        className=" translate-y-[350px] opacity-0 marquee-card group cursor-pointer select-none group w-[28.1rem] mx-[1rem] transform-3d perspective-distant   relative">
                                        <div className="w-full inline-block overflow-hidden">
                                            <p className={` proj_id text-2xl group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
                                        </div>
                                        <div className="img_card w-full">
                                            {project.img ? (
                                                <Image
                                                    width={400}
                                                    height={400}
                                                    src={project.img}
                                                    alt=""
                                                    draggable={false}
                                                    className="select-none " />
                                            ) : (
                                                <video src={project.vid} loop muted playsInline autoPlay></video>
                                            )}
                                        </div>
                                        <div className="w-full mt-2 inline-block overflow-hidden">
                                            <p className={` proj_det text-2xl group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </InfiniteMarquee>
                        <div className={`track_bar_parent fixed bottom-20  h-14 left-0 w-full opacity-0 pointer-events-none`}>
                            <TrackBar ref={trackRef} />
                        </div>
                        <div className={`track_bar_parent fixed bottom-10 opacity-0 pointer-events-none left-0 w-full`}>
                            <InfiniteMarquee>
                                {bar_data.map((month, index) => (
                                    <div key={index} className="w-[40vw]">
                                        <p className="month uppercase text-xl pp_mono">{month.label}</p>
                                    </div>
                                ))}
                            </InfiniteMarquee>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Hero