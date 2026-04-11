"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { ProjectsData } from "@/utils/projectsData";
import { useParams, useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { sound } from "@/utils/sound";

gsap.registerPlugin(Flip);

export default function ProjectDetail() {

    const router = useRouter();
    const swiperRef = useRef(null);
    const params = useParams();
    const slug = params?.slug;

    const project = ProjectsData.find((project) => project.slug === slug);
    const activeIndex = ProjectsData.findIndex(
        (p) => p.slug === slug
    );

    const handleSlideClick = (index, proj) => {
        if (index === activeIndex) return;
        const swiper = swiperRef.current;
        if (!swiper) return;
        sound.playClick()

        flipState.fromSwiper = true;
        swiper.slideToLoop(index);

        const tl = gsap.timeline({
            onComplete: () => {
                router.push(`/project/${proj.slug}`);
            }
        });

        tl.to(".anim_txt", {
            transform: "translateY(-1rem)",
            opacity: 0,
            ease: "expo.in",
            stagger: {
                from: "start",
                each: 0.05
            },
        })
        tl.to(".draw_line", {
            height: "100vh",
            ease: "expo.out",
            duration: 1
        }, "<")
    };

    useLayoutEffect(() => {
        if (!flipState.state || !project) return;

        const el = document.querySelector(
            `[data-flip-id="box-${project.id}"]`
        );

        if (!el) return;

        gsap.set(el, { opacity: 1 });

        Flip.from(flipState.state, {
            targets: el,
            duration: .7,
            ease: "power3.inOut",
            absolute: true,
        });

        flipState.state = null;
    }, [project]);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: flipState.fromSwiper ? 0 : .5 });
        if (!flipState.fromSwiper) {
            tl.to(".box2", {
                opacity: 1,
                ease: "expo.out",
            })
        } else {
            gsap.to(".box2", {
                opacity: 0,
                delay:.5,
                duration:0.1
            })
        }
        tl.to([".anim_txt", ".close_btn"], {
            transform: "translateY(0)",
            opacity: 1,
            ease: "expo.out",
            stagger: 0.05,
        })
        tl.to(".draw_line", {
            height: "100vh",
            ease: "expo.out",
            duration: 0.5
        }, "<")
        if(flipState.fromSwiper) return
        tl.to(".box2", {
            opacity: 0,
            ease: "expo.in",
            duration: 1
        })
        tl.to(".mySwiper", {
            opacity: 1,
            ease: "expo.out",
            duration: 1
        }, "<")
    })

    useEffect(() => {
        if (!swiperRef.current || activeIndex === -1) return;
        swiperRef.current.slideToLoop(activeIndex, 0);
    }, [activeIndex]);

    return (
        <>
            <div className=" fixed z-10 top-0 about_page_left w-[40%] h-screen flex gap-x-5 justify-center items-center">

                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={0}
                    speed={500}
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    loop={true}
                    initialSlide={activeIndex}
                    allowTouchMove={false}
                    simulateTouch={false}
                    className={`mySwiper  relative pointer-events-auto ${flipState.fromSwiper ? "opacity-100" : "opacity-0"}  `}
                >
                    {ProjectsData.map((proj, i) => (
                        <SwiperSlide key={i} className="transition-opacity duration-500 ease-in-out w-[18.5vw]!">
                            <div
                                onClick={() => handleSlideClick(i, proj)}
                                className={`  w-full  relative overflow-hidden cursor-pointer`}
                            >
                                <div className="w-full inline-block overflow-hidden">
                                    <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
                                </div>
                                <div className="img_card w-full">
                                    {proj.img ? (
                                        <img
                                            src={proj.img}
                                            alt=""
                                            draggable={false}
                                            className="select-none " />
                                    ) : (
                                        <video src={proj.vid} loop muted playsInline autoPlay></video>
                                    )}
                                </div>
                                <div className="w-full mt-2 inline-block overflow-hidden">
                                    <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div data-flip-id={`box-${project.id}`} className={`absolute z-10 box2 ${flipState.fromSwiper ? "opacity-100" : "opacity-0"}   w-[18.5vw] pointer-events-none `}>
                    <div className="w-full inline-block overflow-hidden">
                        <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
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
                        <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                    </div>
                </div>

            </div>

            <Link onClick={() => sound.playClick()} href={"/"} className={`close_btn ${flipState.fromSwiper ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[2rem]"}  font-sans  text-xl leading-none z-10 fixed top-5 left-[42%] mix-blend-difference`}>
                <span className="text-white hover:underline">
                    Close
                </span>
            </Link>

            <div className={`fixed top-0 left-[40%] draw_line w-[1px]  ${flipState.fromSwiper ? "h-screen" : "  h-0"} bg-black/10`}></div>

            <div className="about_page_paren w-full flex  relative ">
                <div className="w-[40%] pointer-events-none"></div>
                <div className="about_page_right p-5 relative w-[60%]">
                    <div className="space-y-14">
                        <div className="space-y-5 px-32 pt-20 ">
                            <h3 className=" anim_txt opacity-0 translate-y-[2rem] pp_mono">(APRIL)</h3>
                            <h1 className=" anim_txt opacity-0 translate-y-[2rem]  text-6xl uppercase bold">A$AP X Rayban</h1>
                            <p className="text-xl anim_txt opacity-0 translate-y-[2rem]  ">The collaboration between A$AP Rocky and Ray-Ban represents a bold strategic move for one of the most iconic brands in global eyewear. In a category often driven by heritage and nostalgia, Ray-Ban chose to look forward by appointing A$AP Rocky as its first-ever Creative Director, pushing traditional celebrity endorsements toward deeper cultural co-creation.</p>

                            <p className="text-xl anim_txt opacity-0 translate-y-[2rem] ">    Rather than simply lending his image to a campaign, Rocky was given creative control over product design, visual language and brand storytelling. The result is the Blacked Out Collection, a reinterpretation of classic Ray-Ban silhouettes infused with sharper lines, darker tones and luxury details that reflect contemporary street culture and high fashion sensibilities.</p>
                        </div>
                        <div className=" w-full aspect-video anim_txt opacity-0 translate-y-[2rem]">
                            <img src="https://www.datocms-assets.com/106915/1746532976-cover.jpg?auto=format&dpr=1.5&fit=max&h=1000&q=85&w=1000" alt="" />
                        </div>
                        <div className="space-y-5 px-32  ">
                            <p className="text-xl anim_txt opacity-0 translate-y-[2rem] ">The collaboration between A$AP Rocky and Ray-Ban represents a bold strategic move for one of the most iconic brands in global eyewear. In a category often driven by heritage and nostalgia, Ray-Ban chose to look forward by appointing A$AP Rocky as its first-ever Creative Director, pushing traditional celebrity endorsements toward deeper cultural co-creation.
                                <br /> <br />
                                Rather than simply lending his image to a campaign, Rocky was given creative control over product design, visual language and brand storytelling. The result is the Blacked Out Collection, a reinterpretation of classic Ray-Ban silhouettes infused with sharper lines, darker tones and luxury details that reflect contemporary street culture and high fashion sensibilities.</p>
                        </div>

                        <div className="w-full grid grid-cols-7 gap-y-32 pb-32">

                            <div className="col-span-3">
                                <img src="https://www.datocms-assets.com/106915/1746532990-1.jpg?auto=format&fit=max&h=1000&q=85&w=1000" alt="" />
                                <p className="pp_mono mt-2">01</p>
                            </div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className="  col-span-2">
                                <img src="https://www.datocms-assets.com/106915/1746533001-2.jpg?auto=format&fit=max&h=1000&q=85&w=1000" alt="" />
                                <p className="pp_mono mt-2">02</p>
                            </div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className="col-span-4">
                                <img src="https://www.datocms-assets.com/106915/1746533011-3.jpg?auto=format&fit=max&h=1000&q=85&w=1000" alt="" />
                                <p className="pp_mono mt-2">03</p>
                            </div>
                            <div className=""></div>
                            <div className="col-span-2">
                                <img src="https://www.datocms-assets.com/106915/1746533021-4.jpg?auto=format&fit=max&h=1000&q=85&w=1000" alt="" />
                                <p className="pp_mono mt-2">04</p>
                            </div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className="col-span-3">
                                <img src="https://www.datocms-assets.com/106915/1746533031-5.jpg?auto=format&fit=max&h=1000&q=85&w=1000" alt="" />
                                <p className="pp_mono mt-2">05</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}