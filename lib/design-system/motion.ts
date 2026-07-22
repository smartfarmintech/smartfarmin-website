// AgreeConnect Enterprise Design System - Motion & Animation Utilities
// Framer Motion configurations for consistent animations

export const motionConfig = {
  // VARIANTS - Reusable animation patterns
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4 },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4 },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 },
  },

  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },

  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },

  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 },
    transition: { duration: 0.5 },
  },

  // STAGGER CONTAINER
  containerStagger: {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  },

  itemStagger: {
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },

  // HOVER EFFECTS
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },

  hoverLift: {
    whileHover: { y: -4 },
    transition: { duration: 0.2 },
  },

  hoverBrighten: {
    whileHover: { opacity: 0.9 },
    transition: { duration: 0.2 },
  },

  // BUTTON ANIMATIONS
  buttonHover: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },

  // CARD ANIMATIONS
  cardHover: {
    whileHover: { y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
    transition: { duration: 0.3 },
  },

  // LOADING ANIMATIONS
  spin: {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 1, ease: "linear" },
  },

  pulse: {
    animate: { opacity: [1, 0.5, 1] },
    transition: { repeat: Infinity, duration: 2 },
  },

  shimmer: {
    animate: { backgroundPosition: ["0% 0%", "100% 0%"] },
    transition: { repeat: Infinity, duration: 2 },
  },

  // PAGE TRANSITIONS
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  },

  // MODAL ANIMATIONS
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  modalContent: {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.9, opacity: 0, y: 20 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },

  // NOTIFICATION ANIMATIONS
  toastSlideIn: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },

  // ACCORDION ANIMATIONS
  accordionOpen: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 },
  },
};

// TIMING FUNCTIONS
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInCirc: [0.6, 0.04, 0.98, 0.335],
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
};

// TRANSITION HELPERS
export const transitionConfig = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  slower: { duration: 0.7 },
  spring: { type: "spring", stiffness: 100, damping: 10 },
  springLightly: { type: "spring", stiffness: 300, damping: 30 },
  springStiff: { type: "spring", stiffness: 500, damping: 25 },
};
