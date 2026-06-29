// src/components/ui/progress.jsx
const Progress = ({ value, max = 100, className = '', ...props }) => {
  const percentage = Math.min(Math.max(value / max, 0), 1) * 100;

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
      <div
        className="h-full w-full min-w-[10%] flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
};

export { Progress };