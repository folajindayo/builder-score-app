/**
 * Micro-interaction utilities and presets
 */

import { Variants } from "framer-motion";

/**
 * Button press animation
 */
export const buttonPress: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/**
 * Card lift animation
 */
export const cardLift: Variants = {
  initial: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { 
    y: -4, 
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  },
};

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide in from bottom
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Scale in animation
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/**
 * Rotate animation
 */
export const rotate: Variants = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
};

/**
 * Pulse animation
 */
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
};

/**
 * Shake animation for errors
 */
export const shake: Variants = {
  initial: { x: 0 },
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  },
};

/**
 * Bounce animation
 */
export const bounce: Variants = {
  initial: { y: 0 },
  animate: { 
    y: [0, -10, 0],
    transition: { 
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 1
    }
  },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger item animation
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

