export const GOAL_OPTIONS = [
    { value: "5k", label: "5K Race" },
    { value: "10k", label: "10K Race" },
    { value: "half-marathon", label: "Half Marathon" },
    { value: "marathon", label: "Marathon" },
    { value: "weight-loss", label: "Weight Loss" },
    { value: "general-fitness", label: "General Fitness" },
  ];
  
  export const TIMELINE_OPTIONS = [4, 8, 12, 16].map(weeks => ({
    value: weeks,
    label: `${weeks} weeks`,
  }));