// import { useState } from 'react';

// interface TooltipProps {
//     content: string;
//     children: React.ReactNode;
//     position?: 'top' | 'bottom';
//     width?: string;
// }

// const Tooltip = ({ content, children, position = 'top', width = 'w-40' }: TooltipProps) => {
//     const [isVisible, setIsVisible] = useState(false);

//     return (
//         <span className="relative inline-block">
//             <span
//                 onMouseEnter={() => setIsVisible(true)}
//                 onMouseLeave={() => setIsVisible(false)}
//                 className="cursor-help"
//             >
//                 {children}
//             </span>
//             {isVisible && (
//                 <div className={`absolute left-1/2 -translate-x-1/2 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} px-2 py-2.5 bg-foreground text-background text-[10px] rounded-lg shadow-lg text-center ${width} pointer-events-none`} style={{ zIndex: 9999 }}>
//                     {content}
//                     {/* Arrow */}
//                     <div className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] ${position === 'top' ? 'border-t-[6px] border-transparent border-t-foreground' : 'border-b-[6px] border-transparent border-b-foreground'}`} />
//                 </div>
//             )}
//         </span>
//     );
// };

// export default Tooltip;





// src/components/order/Tooltip.tsx
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  width?: string;
}

const Tooltip = ({ 
  content, 
  children, 
  position = 'top', 
  width = 'w-40' 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let top = rect.top + scrollTop;
    let left = rect.left + scrollLeft + rect.width / 2;

    if (position === 'top') {
      top -= 42; // space for arrow + padding
    } else {
      top += rect.height + 12;
    }

    setCoords({ top, left });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
    setCoords(null);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block cursor-help"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </span>

      {isVisible && coords && createPortal(
        <div
          className={`fixed ${width} px-3 py-2.5 bg-foreground text-background text-[10px] rounded-lg shadow-lg text-center pointer-events-none z-50`}
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translateX(-50%) translateY(0)',
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 
              ${position === 'top' 
                ? 'bottom-[-6px] border-l-[6px] border-r-[6px] border-t-[6px] border-t-foreground border-l-transparent border-r-transparent'
                : 'top-[-6px] border-l-[6px] border-r-[6px] border-b-[6px] border-b-foreground border-l-transparent border-r-transparent'
              }`}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;