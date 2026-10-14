"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  id?: string;
}

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 24,
  className,
  id,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0, 0, 1], // cubic-bezier(0.2, 0, 0, 1) Material easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
