"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

const useScrambleText = (trigger) => {
  const tlRef = useRef(null);
  const splitsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.5,
        ease: "expo.inOut",
      },
    });

    const elements = gsap.utils.toArray(".js-text");

    elements.forEach((el, index) => {
      // lock layout
      const height = el.offsetHeight;
      el.style.height = height + "px";
      el.style.overflow = "hidden";
      el.style.display = "block";
      el.style.position = "relative";

      const split = new SplitText(el, { type: "lines" });
      splitsRef.current.push(split);

      split.lines.forEach((line) => {
        line.dataset.text = line.textContent;
      });

      tl.fromTo(
        split.lines,
        {
          scrambleText: " ",
        },
        {
          duration: 0.3,
          ease: "power2.out",
          scrambleText: {
            text: (i) => split.lines[i].dataset.text,
            chars: "abcdefghijklmnopqrstuvwxyz",
          },
          stagger: 0.05,
        },
        0.5 + index * 0.03
      );
    });

    tlRef.current = tl;

    return () => {
      tl.kill();

      // ✅ revert ONLY on unmount
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;

    if (trigger) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse(); // ✅ now works
    }
  }, [trigger]);
};

export default useScrambleText;