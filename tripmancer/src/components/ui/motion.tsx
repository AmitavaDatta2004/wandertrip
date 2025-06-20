
import React from 'react';
import { cn } from "@/lib/utils";

interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
  };
  animate?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
  };
  transition?: {
    duration?: number;
    delay?: number;
    type?: string;
    stiffness?: number;
    damping?: number;
  };
}

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionProps>(
    ({ className, initial, animate, transition, ...props }, ref) => {
      const [isClient, setIsClient] = React.useState(false);
      
      React.useEffect(() => {
        setIsClient(true);
      }, []);
      
      const style = React.useMemo(() => {
        if (!isClient) return {};
        
        return {
          opacity: animate?.opacity !== undefined ? animate.opacity : 1,
          transform: `translate(${animate?.x || 0}px, ${animate?.y || 0}px) scale(${animate?.scale || 1})`,
          transition: `all ${transition?.duration || 0.3}s ease-out ${transition?.delay || 0}s`,
        };
      }, [isClient, animate, transition]);
      
      // Initial style for server-side rendering
      const initialStyle = {
        opacity: initial?.opacity !== undefined ? initial.opacity : isClient ? 1 : 0,
        transform: `translate(${initial?.x || 0}px, ${initial?.y || 0}px) scale(${initial?.scale || 1})`,
      };
      
      return (
        <div
          ref={ref}
          className={cn(className)}
          style={isClient ? style : initialStyle}
          {...props}
        />
      );
    }
  )
};
