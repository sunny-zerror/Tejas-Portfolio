"use client"

import { musicData } from '@/utils/musicData';
import { sound } from '@/utils/sound';
import { RiPauseLine, RiPlayLine } from '@remixicon/react';
import gsap from 'gsap';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee';

const navLinks = [
  { id: 1, label: 'Home', href: "/" },
  { id: 2, label: "About", href: "/about" },
  { id: 3, label: "Contact", href: "/contact" }
];

const Header = () => {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(musicData[0]);
  const [prevTrack, setPrevTrack] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack?.music) return;

    audio.src = activeTrack.music;

    if (isPlaying) {
      audio.play().catch(() => { });
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!prevTrack) return;

    const tl = gsap.timeline({
      onComplete: () => setPrevTrack(null),
    });

    tl.fromTo(".new_track",
      { y: 40 },
      { y: 0, duration: 0.5, ease: "power2.out" },
      0
    )
      .to(".old_track",
        { y: -40, duration: 0.5, ease: "power2.out" },
        0
      )

      .fromTo(".new_text",
        { y: 40, },
        { y: 0, duration: 0.5, ease: "power2.out" },
        0
      )
      .to(".old_text",
        { y: -40, duration: 0.5, ease: "power2.out" },
        0
      );

  }, [activeTrack]);

  const handlePlayToggle = () => {
    sound.play("click");
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="fixed pointer-events-none w-full top-0 left-0 flex items-start justify-between padding py-5! z-20">

      <nav className="text-black gap-x-3 font-sans font-semibold text-xl tracking-tighter leading-none flex items-center">
        {navLinks.map((link) => (
          <Link
            onClick={() => sound.playClick()}
            href={link.href}
            key={link.id}
            className={`pointer-events-auto ${pathname === link.href ? "opacity-100" : "opacity-50"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div
        className="music_slt relative w-[35vw] flex gap-1.5 flex-col items-end pointer-events-auto"
        onMouseLeave={() => setIsPlayerVisible(false)}
      >
        <audio ref={clickAudioRef} src="/music/click.mp3" preload="auto" />
        <audio ref={audioRef} playsInline preload="auto" />

        <div
          onClick={handlePlayToggle}
          onMouseEnter={() => setIsPlayerVisible(true)}
          className="running_music_preview cursor-pointer w-[42%] border flex gap-2 items-center p-1.5 border-black/10 rounded-sm bg-gray-50"
        >
          <div className="aspect-square w-8 rounded-sm overflow-hidden relative center">
            <div className="absolute z-20 text-white">
              {isPlaying ? <RiPauseLine size={18} /> : <RiPlayLine size={18} />}
            </div>

            <div className="relative w-full h-full overflow-hidden">

              {/* OLD */}
              {prevTrack && (
                <div className="absolute inset-0 old_track">
                  <img src={prevTrack.poster} className="cover" />
                  <div>{prevTrack.singer} - {prevTrack.title}</div>
                </div>
              )}

              {/* NEW */}
              <div className="absolute inset-0 new_track">
                <img src={activeTrack.poster} className="cover" />
                <div>{activeTrack.singer} - {activeTrack.title}</div>
              </div>

            </div>
          </div>

          <div className="relative flex-1 overflow-hidden h-8 text-xl">

            {prevTrack && (
              <div className="absolute h-full flex items-center inset-0 old_text">
                <Marquee speed={isPlaying ? 30 : 0}>
                  <p>{prevTrack.singer} - {prevTrack.title}</p>
                  <p className="mx-3"> / </p>
                </Marquee>
              </div>
            )}

            <div className="absolute h-full flex items-center inset-0 new_text">
              <Marquee speed={isPlaying ? 30 : 0}>
                <p>{activeTrack.singer} - {activeTrack.title}</p>
                <p className="mx-3"> / </p>
              </Marquee>
            </div>

          </div>
        </div>

        <div
          className={`music_player w-full bg-gray-50 border border-black/10 rounded-sm transition-all duration-300 origin-top ${isPlayerVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          {musicData.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sound.play("click");

                setPrevTrack(activeTrack);
                setActiveTrack(item);

                if (!isPlaying) setIsPlaying(true);
              }}
              className={`w-full text-xl group h-15 cursor-pointer p-1.5 border-b border-black/10 last:border-none flex items-center gap-x-4 pr-4 transition-colors ${activeTrack.id === item.id
                ? "bg-gray-200"
                : "hover:bg-gray-100"
                }`}
            >
              <div className="h-full aspect-square rounded-sm relative center">
                <div
                  className={`absolute z-20 text-white opacity-0 ${activeTrack.id === item.id
                    ? ""
                    : "group-hover:opacity-100"
                    }`}
                >
                  <RiPlayLine size={18} />
                </div>

                {activeTrack.id === item.id && (
                  <div className="absolute z-20 text-white">
                    {isPlaying ? (
                      <RiPauseLine size={18} />
                    ) : (
                      <RiPlayLine size={18} />
                    )}
                  </div>
                )}

                <img src={item.poster} className="cover" alt={item.title} />
              </div>

              <div className="w-full flex justify-between">
                <p>{item.title}</p>
                <p>{item.singer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;