import { ValueAnimationTransition } from "framer-motion";

export const framerMotionConfig: ValueAnimationTransition = {
  type: "spring",
  mass: 5,
  stiffness: 500,
  damping: 55,
  restDelta: 0.0001,
};
