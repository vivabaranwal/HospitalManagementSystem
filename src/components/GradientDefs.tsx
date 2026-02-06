export function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(330, 85%, 60%)" />
          <stop offset="100%" stopColor="hsl(350, 90%, 45%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
