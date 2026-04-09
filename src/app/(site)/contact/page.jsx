"use client";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import { flipState } from "@/utils/flipStore";

gsap.registerPlugin(Flip);

export default function ContactPage() {
    const router = useRouter();

    const handleClick = (e) => {
        const el = e.currentTarget;
        flipState.element = el;
        flipState.state = Flip.getState(el);
        router.push("/project/project-title");
    };

    return (
        <div className="contact_page_paren w-full h-screen flex gap-x-5 justify-center items-center">
            <div onClick={handleClick} data-flip-id="box" className="box1 aspect-square bg-yellow-400 size-44"></div>
            <div onClick={handleClick} data-flip-id="box" className="box2 aspect-square bg-yellow-400 size-44"></div>
            <div onClick={handleClick} data-flip-id="box" className="box3 aspect-square bg-yellow-400 size-44"></div>
        </div>
    );
}