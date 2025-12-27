import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  color?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, color }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative h-3 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color || '#10b981' }}
      />
    </div>
  );
});
Progress.displayName = 'Progress';

export { Progress };
