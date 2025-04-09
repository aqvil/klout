import { FC } from 'react';
import { Link } from 'wouter';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export const Logo: FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}) => {
  // Map sizes to actual pixel values
  const sizeMap = {
    sm: variant === 'full' ? 'h-6' : 'h-8',
    md: variant === 'full' ? 'h-8' : 'h-10',
    lg: variant === 'full' ? 'h-10' : 'h-12'
  };

  return (
    <Link href="/">
      <div className={`inline-flex items-center cursor-pointer ${className}`}>
        {variant === 'full' ? (
          <div className="flex items-center">
            <div className={`${sizeMap[size]} relative`}>
              <svg 
                viewBox="0 0 120 40" 
                xmlns="http://www.w3.org/2000/svg"
                className={`${sizeMap[size]}`}
                fill="none"
              >
                {/* K */}
                <path 
                  d="M15 5H5V35H15V22L25 35H37L23 18L37 5H25L15 18V5Z" 
                  fill="currentColor" 
                  className="text-primary"
                />
                {/* L */}
                <path 
                  d="M40 5H50V35H70V25H50V5H40Z" 
                  fill="currentColor"
                />
                {/* O */}
                <path 
                  d="M72 20C72 10 78 4 88 4C98 4 104 10 104 20C104 30 98 36 88 36C78 36 72 30 72 20ZM88 28C93 28 95 25 95 20C95 15 93 12 88 12C83 12 81 15 81 20C81 25 83 28 88 28Z" 
                  fill="currentColor"
                />
                {/* U */}
                <path 
                  d="M107 5H117V25C117 27 117 28 119 28C121 28 121 27 121 25V5H131V25C131 32 127 36 119 36C111 36 107 32 107 25V5Z" 
                  fill="currentColor"
                />
                {/* Soccer ball icon */}
                <circle 
                  cx="88" 
                  cy="20" 
                  r="6" 
                  fill="currentColor" 
                  className="text-primary" 
                  opacity="0.7"
                />
              </svg>
            </div>
            <span className={`ml-2 font-bold tracking-tight ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
              klout<span className="text-primary">.soccer</span>
            </span>
          </div>
        ) : (
          <div className={`${sizeMap[size]} relative`}>
            <svg 
              viewBox="0 0 40 40" 
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeMap[size]}`}
              fill="none"
            >
              {/* K icon */}
              <path 
                d="M15 5H5V35H15V22L25 35H37L23 18L37 5H25L15 18V5Z" 
                fill="currentColor" 
                className="text-primary"
              />
              {/* Soccer ball icon */}
              <circle 
                cx="30" 
                cy="30" 
                r="6" 
                fill="currentColor" 
                className="text-primary" 
                opacity="0.7"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
};