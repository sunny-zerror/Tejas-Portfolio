"use client";
import { RiArrowRightLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import useScrambleText from '../effects/useScrambleText';
import gsap from 'gsap';
import { sound } from '@/utils/sound';

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
    const [open, setOpen] = useState(true);
    useScrambleText(open);
    const [introLoaded, setIntroLoaded] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const leftColumn = monthsData.slice(0, 7);
    const rightColumn = monthsData.slice(7);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (introLoaded) {
            const tl = gsap.timeline({ delay: 0.8 });
            tl.to(".click_btn", {
                opacity: 0,
                pointerEvents: "none",
            })
            tl.to(".hero_title", {
                top: "1rem",
                ease: "expo.out",
                duration: 1,
            });
            tl.to(".loader_paren", {
                zIndex: -1,
                duration: 0.1
            });
            tl.to(".marquee-card", {
                opacity: 1,
                transform: "translateY(0rem)",
                ease: "expo.out",
                duration: 1,
                stagger: 0.05
            })

        }
    }, [introLoaded]);




    return (
        <>
            <div className=" loader_paren w-full h-screen fixed z-100 center pt-[16%] pointer-events-none bg-white  ">
                <div className=" hero_title absolute top-[35%] z-10 mix-blend-difference left-1/2 -translate-x-1/2 text-center text-[4.6rem] bold">
                    <h1 className=' text-white leading-16'>Better Off® <br /> THE LOOKBACK <br />(BO®S/2026)</h1>
                </div>
                <button onClick={() => { sound.play("click"), setIntroLoaded(true), setOpen(false) }} className=' click_btn pointer-events-auto flex group items-center gap-x-2 leading-none text-xl border hover:bg-gray-100 transition-colors duration-300 border-black/10 rounded-sm py-2.5 px-4'>Enter with sound
                    <div className="flex w-4  aspect-square overflow-hidden">
                        <RiArrowRightLine size={15} className='shrink-0 -translate-x-full group-hover:translate-x-0 transition-all duration-300' />
                        <RiArrowRightLine size={15} className='shrink-0 -translate-x-full group-hover:translate-x-0 transition-all duration-300' />
                    </div>
                </button>

                <p className=" load_txt absolute text-sm pp_mono font-semibold top-5 left-5 uppercase">
                    <span
                        className={`transition-opacity js-text duration-500  ${loaded ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        Loading...
                    </span>

                    <span
                        className={`absolute left-0 -top-4 js-text transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Loaded
                    </span>
                </p>
                <div className=" leading-tight text-sm font-semibold pp_mono absolute top-6 right-0">
                    <div className="grid grid-cols-2 ">
                        {[leftColumn, rightColumn].map((column, colIndex) => (
                            <div key={colIndex}>
                                {column.map((monthData, index) => (
                                    <div key={index} className=" w-[17vw]  mb-1">
                                        <div className="js-text relative block will-change-transform  uppercase">{monthData.month}</div>

                                        <div className="pl-5 js-text relative block will-change-transform  ">
                                            {monthData.items.map((item, i) => (
                                                <div key={i}>
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