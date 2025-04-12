export const GOAL_OPTIONS = [
  { value: "5k", label: "5K Race" },
  { value: "10k", label: "10K Race" },
  { value: "half-marathon", label: "Half Marathon" },
  { value: "marathon", label: "Marathon" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "general-fitness", label: "General Fitness" },
];

export const TIMELINE_OPTIONS = [4, 8, 12, 16].map((weeks) => ({
  value: weeks,
  label: `${weeks} weeks`,
}));

export const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6].map((days) => ({
  value: days,
  label: `${days} days/week`,
}));

export const LONG_RUN_DAY_OPTIONS = [
  { value: "Sunday", label: "Sunday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Friday", label: "Friday" },
  { value: "Thursday", label: "Thursday" },
];

export const INJURY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "knee-pain", label: "Knee Pain" },
  { value: "shin-splints", label: "Shin Splints" },
  { value: "plantar-fasciitis", label: "Plantar Fasciitis" },
];