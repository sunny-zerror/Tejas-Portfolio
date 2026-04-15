"use client";
import { RiArrowRightLine } from '@remixicon/react'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap';
import { sound } from '@/utils/sound';
import { useScrambleText } from '../effects/useScrambleText';
import { useGSAP } from '@gsap/react';
import { useAppStore } from '../store/useAppStore';

const monthsData = [
    {
        month: "January",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
        ],
    },
    {
        month: "February",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
        ],
    },
    {
        month: "March",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
        ],
    },
    {
        month: "April",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
        ],
    },
    {
        month: "May",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
        ],
    },
    {
        month: "June",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
        ],
    },
    {
        month: "July",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
        ],
    },
    {
        month: "August",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
        ],
    },
    {
        month: "September",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
        ],
    },
    {
        month: "October",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
            { title: "CLIENTS", count: 4 },
            { title: "INSPIRATION", count: 12 },
        ],
    },
    {
        month: "November",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
            { title: "CLIENTS", count: 4 },
            { title: "INSPIRATION", count: 12 },
        ],
    },
    {
        month: "December",
        items: [
            { title: "ARTICLES", count: 3 },
            { title: "PODCAST EPISODES", count: 2 },
            { title: "INSPIRATION", count: 4 },
            { title: "MUSIC PLAYLIST", count: 12 },
            { title: "CASES", count: 1 },
        ],
    },
];

const Introloader = () => {
    const setIntroLoaded = useAppStore((state) => state.setIntroLoaded);
    const hasIntroLoaded = useAppStore((state) => state.hasIntroLoaded);
    const setMusicPlaying = useAppStore((state) => state.setMusicPlaying);
    const ref = useRef(null);
    const [mode, setMode] = useState("forward");

    useScrambleText({
        ref,
        mode,
    });

    const [loaded, setLoaded] = useState(false);
    const leftColumn = monthsData.slice(0, 7);
    const rightColumn = monthsData.slice(7);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1.75 })
        tl.to(".click_btn", {
            opacity: 1,
            stagger: 0.1
        })
    })

    useEffect(() => {
        if (hasIntroLoaded) {
            console.log("object");
            const completeTl = gsap.timeline();
            completeTl.to([".load_txt", ".click_btn"], {
                opacity: 0,
                stagger: 0.1,
                ease: "expo.out"
            })
        }
    }, [hasIntroLoaded])



    return (
        <>
            <div className="noise fixed inset-0 pointer-events-none will-change-transform z-[9999]"></div>
            <div className={`loader_paren w-full mix-blend-difference text-white h-screen fixed z-100 center pt-[22%] pointer-events-none ${hasIntroLoaded ? "opacity-0 delay-75 transition-all duration-300" : "opacity-100"} `}>
                <p className=" load_txt  absolute text-[1.35rem] pp_mono   top-5 left-5 uppercase">
                    <span
                        className={`transition-opacity duration-500  ${loaded ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        Loading...
                    </span>

                    <span
                        className={`absolute left-0  transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Loaded
                    </span>
                </p>

                <div className=" text-center space-y-5">
                    <button onClick={() => { sound.play("click"), setIntroLoaded(true), setMode("reverse"), setMusicPlaying(true) }} className={`click_btn opacity-0 ${hasIntroLoaded ? "pointer-events-none" : "pointer-events-auto"}  flex group items-center gap-x-2 leading-none text-3xl  border hover:bg-white/5 transition-colors duration-300 border-white/10 rounded-sm py-4 px-6`}>
                        <p className=' tracking-wide'>
                            Enter with sound
                        </p>
                        <div className="flex w-6  aspect-square overflow-hidden">
                            <RiArrowRightLine size={15} className='shrink-0 -translate-x-full group-hover:translate-x-0 transition-all duration-300' />
                            <RiArrowRightLine size={15} className='shrink-0 -translate-x-full group-hover:translate-x-0 transition-all duration-300' />
                        </div>
                    </button>
                    <button  onClick={() => { setIntroLoaded(true), setMode("reverse")}} className={`click_btn group relative opacity-0 mix-blend-difference text-xl ${hasIntroLoaded ? "pointer-events-none" : "pointer-events-auto"}  text-[#ffffff4d] `}>
                        ...or without
                        <span className='absolute bottom-[1px] h-[1px] bg-[#ffffff4d] w-0 left-0 group-hover:w-full transition-all duration-300 ease-out rounded-full'></span>
                    </button>

                </div>



                <div
                    ref={ref}
                    className="leading-tight text-[1.35rem]  pp_mono absolute top-6 right-0"
                >
                    <div className="grid grid-cols-2">

                        {[leftColumn, rightColumn].map((column, colIndex) => (
                            <div key={colIndex} className="js-col">

                                {column.map((monthData, index) => (
                                    <div key={index} className=" mix-blend-difference  js-block w-[17vw] mb-1">

                                        {/* month */}
                                        <div className="js-text uppercase">
                                            {monthData.month}
                                        </div>

                                        {/* items */}
                                        <div className="pl-5">
                                            {monthData.items.map((item, i) => (
                                                <div key={i} className="js-text whitespace-nowrap">
                                                    {item.title} ({item.count})
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                ))}

                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </>
    )
}

export default Introloader