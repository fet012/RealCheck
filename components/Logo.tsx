type LogoProps = {
  size?: number;
  variant?: 'sage' | 'white';
};

export function Logo({ size = 32, variant = 'sage' }: LogoProps) {
  const shieldFill = variant === 'sage' ? '#87A878' : '#F5F2EC';
  const letterFill = variant === 'sage' ? '#F5F2EC' : '#87A878';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RealCheck"
    >
      <path
        d="M32 4L8 12v18c0 14 10 26 24 30 14-4 24-16 24-30V12L32 4z"
        fill={shieldFill}
      />
      <path
        d="M24 20h10c4 0 6 2 6 5s-2 5-5 5l6 10h-5l-5-9h-2v9h-5V20zm5 4v5h4c1 0 2-1 2-2.5S34 24 33 24h-4z"
        fill={letterFill}
      />
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Real<span className="font-black">Check</span>
    </span>
  );
}