import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  inverted?: boolean;
  markClassName?: string;
  textClassName?: string;
}

const Logo = ({
  className,
  showText = true,
  inverted = false,
  markClassName,
  textClassName,
}: LogoProps) => {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 48 48"
        className={cn('h-9 w-9 shrink-0', markClassName)}
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="11"
          fill={inverted ? '#c9a24a' : '#16294a'}
        />
        <g
          fill="none"
          stroke={inverted ? '#16294a' : '#c9a24a'}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 15h20" />
          <path d="M14 33h20" />
          <path d="M18.5 15v18" />
          <path d="M29.5 15v18" />
        </g>
      </svg>
      {showText && (
        <span
          className={cn(
            'text-xl font-bold tracking-tight',
            inverted ? 'text-white' : 'text-primary',
            textClassName
          )}
        >
          Incorporia<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
