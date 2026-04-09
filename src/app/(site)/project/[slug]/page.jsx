"use client";
import { useEffect } from "react";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";
import { ProjectsData } from "@/utils/projectsData";
import { useParams } from "next/navigation";
import { Link } from "next-view-transitions";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip);

export default function ProjectDetail() {

    const params = useParams();
    const slug = params?.slug;

    const project = ProjectsData.find((project) => project.slug === slug);

useEffect(() => {
    if (!flipState.state || !project) return;

    const el = document.querySelector(
        `[data-flip-id="box-${project.id}"]`
    );

    if (!el) return;

    Flip.from(flipState.state, {
        targets: el,
        duration: 1,
        ease: "power3.inOut",
        absolute: true,
    });

    flipState.state = null;
}, [project]);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1 })
        tl.to(".anim_txt", {
            transform: "translateY(0)",
            opacity: 1,
            ease: "expo.out",
            stagger: 0.1,
        })
        tl.to(".draw_line", {
            height: "100vh",
            ease: "expo.out",
            duration: 1
        }, "<")
    })

    return (
        <>
            <div className=" fixed top-0 about_page_left w-[40%] h-screen flex gap-x-5 justify-center items-center">
                <div data-flip-id={`box-${project.id}`} className="box2 group w-[20vw]">
                    <div className="w-full inline-block overflow-hidden">
                        <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none translate-y-full`}>Project {project.id}</p>
                    </div>
                    <div className="img_card w-full">
                        <img
                            src={project.img}
                            alt=""
                            className="select-none " />
                    </div>
                    <div className="w-full mt-2 inline-block overflow-hidden">
                        <p className={` group-hover:translate-y-0 transition-all duration-300 leading-none -translate-y-full`}>{project.title}</p>
                    </div>
                </div>
            </div>
            <Link href={"/"} className=" anim_txt opacity-0 translate-y-[2rem] text-xl z-10 fixed top-5 left-[42%] mix-blend-difference">
                <span className="text-white hover:underline">
                    Close
                </span>
            </Link>
            <div className=" fixed top-0 left-[40%] draw_line w-[1px] h-0 bg-black/10 "></div>
            <div className="about_page_paren w-full flex  relative ">
                <div className="w-[40%] flex">
                </div>
                <div className="about_page_right p-5 relative w-[60%]">
                    <div className="space-y-14">
                        <div className="space-y-5 px-32 pt-20 ">
                            <h3 className=" anim_txt opacity-0 translate-y-[2rem] pp_mono">(APRIL)</h3>
                            <h1 className=" anim_txt opacity-0 translate-y-[2rem]  text-6xl uppercase bold">A$AP X Rayban</h1>
                            <p className="text-xl anim_txt opacity-0 translate-y-[2rem]  ">The collaboration between A$AP Rocky and Ray-Ban represents a bold strategic move for one of the most iconic brands in global eyewear. In a category often driven by heritage and nostalgia, Ray-Ban chose to look forward by appointing A$AP Rocky as its first-ever Creative Director, pushing traditional celebrity endorsements toward deeper cultural co-creation.</p>

                            <p className="text-xl anim_txt opacity-0 translate-y-[2rem] ">    Rather than simply lending his image to a campaign, Rocky was given creative control over product design, visual language and brand storytelling. The result is the Blacked Out Collection, a reinterpretation of classic Ray-Ban silhouettes infused with sharper lines, darker tones and luxury details that reflect contemporary street culture and high fashion sensibilities.</p>
                        </div>
                        <div className="anim_txt opacity-0 translate-y-[2rem]">
                            <img src="https://www.datocms-assets.com/106915/1746532976-cover.jpg?auto=format&dpr=1.5&fit=max&h=1000&q=85&w=1000" alt="" />
                        </div>
                        <div className="space-y-5 px-32  ">
                            <p className="text-xl ">The collaboration between A$AP Rocky and Ray-Ban represents a bold strategic move for one of the most iconic brands in global eyewear. In a category often driven by heritage and nostalgia, Ray-Ban chose to look forward by appointing A$AP Rocky as its first-ever Creative Director, pushing traditional celebrity endorsements toward deeper cultural co-creation.
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