export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const DURATION = {
  hover: 0.18,
  enter: 0.32,
  pop: 0.16,
} as const;

export const SPRING_PILL = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
};

export const SPRING_TOAST = {
  type: "spring" as const,
  stiffness: 450,
  damping: 32,
};

export const TRANSITION_ENTER = {
  duration: 0.32,
  ease: EASE_OUT,
};

export const TRANSITION_STAGGER = (index: number) => ({
  duration: 0.32,
  delay: 0.03 * index,
  ease: EASE_OUT,
});

export const TRANSITION_POPOVER = {
  duration: 0.16,
  ease: EASE_OUT,
};

export const TRANSITION_ROW = {
  duration: 0.18,
  ease: EASE_OUT,
};
