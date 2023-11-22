import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export const ScrollManager = ({ section, onSectionChange }: { section: number, onSectionChange: Dispatch<SetStateAction<number>> }) => {

  const data = useScroll();
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);

  data.fill.classList.add("top-0");
  data.fill.classList.add("absolute");

  useEffect(() => {
    gsap.to(data.el, {
      duration: 1,
      scrollTop: section * data.el.clientHeight,
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [section]);

  useFrame(() => {
    if (isAnimating.current) {
      lastScroll.current = data.offset;
      return;
    }

    const curSection = Math.floor(data.offset* data.pages);
    if (data.offset > lastScroll.current && curSection === 0) {
      onSectionChange(1);
    }
    if (
      data.offset < lastScroll.current &&
      data.offset < 1 / (data.pages - 1)
    ) {
      onSectionChange(0);
    }
    lastScroll.current = data.offset;
  });

  return null;
};
