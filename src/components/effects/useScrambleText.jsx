import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

export const useScrambleText = ({ ref, mode }) => {
  const tlRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const blocks = ref.current.querySelectorAll(".js-block");

    blocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      block.style.height = rect.height + "px";
    });

    const columns = ref.current.querySelectorAll(".js-col");

    let tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // 👉 FORWARD (intro)
    columns.forEach((col, colIndex) => {
      const blocks = col.querySelectorAll(".js-block");

      blocks.forEach((block, blockIndex) => {
        const texts = block.querySelectorAll(".js-text");

        texts.forEach((el) => {
          if (!el.dataset.text) {
            el.dataset.text = el.textContent;
          }
        });

        tl.fromTo(
          texts,
          { scrambleText: " " },
          {
            duration: 0.5,
            ease: "none",
            scrambleText: {
              text: (i, el) => el.dataset.text,
              chars: "",
            },
            stagger: 0.075,
          },
          0.5 + colIndex * 0.05 + blockIndex * 0.05
        );
      });
    });

    tl.addLabel("out");

    // 👉 REVERSE (exit)
    const reversedCols = [...columns].reverse();

    reversedCols.forEach((col, colIndex) => {
      const blocks = [...col.querySelectorAll(".js-block")].reverse();

      blocks.forEach((block, blockIndex) => {
        const texts = [...block.querySelectorAll(".js-text")].reverse();

        tl.to(
          texts,
          {
            scrambleText: " ",
            duration: 0.4,
            stagger: 0.035,
          },
          `out+=${colIndex * 0.05 + blockIndex * 0.025}`
        );
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

useEffect(() => {
  if (!tlRef.current) return;

  if (mode === "forward") {
    tlRef.current.pause(0).tweenTo("out");
  }

  if (mode === "reverse") {
    tlRef.current.tweenTo(tlRef.current.duration()); // go to end
  }
}, [mode]);
};