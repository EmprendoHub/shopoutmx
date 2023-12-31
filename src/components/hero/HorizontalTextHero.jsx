'use client';
import React from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HorizontalTextHero = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const sliderContainer = useRef(null);

  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    requestAnimationFrame(animation);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: slider.sliderContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25,

        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: '-=300px',
    });
  }, []);

  const animation = () => {
    if (xPercent <= -100) {
      xPercent = 0;
    }
    if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    xPercent += 0.07 * direction;
    requestAnimationFrame(animation);
  };

  return (
    <motion.main
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9 }}
      ref={sliderContainer}
      className="relative flex items-center justify-center min-h-[95vh] overflow-hidden w-full mb-40"
    >
      <Image
        src={'/images/black-dress-expressing-true-exitement.jpg'}
        alt="main image"
        fill={true}
        objectFit="cover"
        className="grayscale"
      />
      {/* overlay */}
      <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black opacity-30" />
      <div className="slider-container-class z-[5] absolute top-[calc(95vh_-_300px)] p-5 ">
        <div
          ref={slider}
          className="slider font-EB_Garamond relative text-white flex whitespace-nowrap"
        >
          <p ref={firstText} className="m-0 text-[200px]  ">
            <span className="mr-7">
              Explora para deslumbrar y transformar tu estilo -
            </span>
          </p>
          <p ref={secondText} className="m-0  text-[200px] absolute left-full">
            <span className="mr-7">
              Explora para deslumbrar y transformar tu estilo -
            </span>
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default HorizontalTextHero;
