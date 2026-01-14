
import React from 'react';

export const MambaSnakeIcon: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-500`}
    >
      <path 
        d="M20 80C20 80 15 70 30 60C45 50 70 65 80 45C90 25 60 15 40 25C20 35 15 15 40 10C65 5 95 15 95 45C95 75 70 95 40 90C10 85 5 70 20 80Z" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-pulse"
      />
      <circle cx="28" cy="18" r="2" fill="currentColor" />
      <path d="M15 20L5 15M15 25L5 30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 45L75 42M70 50L75 53" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
};
