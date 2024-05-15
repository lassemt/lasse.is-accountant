export function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};
