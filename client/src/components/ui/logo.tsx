import React from 'react';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  includeText?: boolean;
}

export function KloutLogo({ 
  variant = 'default', 
  size = 'md', 
  includeText = true 
}: LogoProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return { logoSize: 24, fontSize: 'text-lg' };
      case 'lg': return { logoSize: 40, fontSize: 'text-3xl' };
      default: return { logoSize: 32, fontSize: 'text-2xl' };
    }
  };

  const getColors = () => {
    switch (variant) {
      case 'light': return { primary: 'white', secondary: 'white' };
      case 'dark': return { primary: '#121212', secondary: '#121212' };
      default: return { primary: '#3B82F6', secondary: '#6D28D9' };
    }
  };

  const { logoSize, fontSize } = getSize();
  const { primary, secondary } = getColors();

  return (
    <div className="flex items-center">
      <div className="mr-2">
        <svg 
          width={logoSize} 
          height={logoSize} 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M32 0C14.327 0 0 14.327 0 32C0 49.673 14.327 64 32 64C49.673 64 64 49.673 64 32C64 14.327 49.673 0 32 0ZM32 8C45.25 8 56 18.75 56 32C56 45.25 45.25 56 32 56C18.75 56 8 45.25 8 32C8 18.75 18.75 8 32 8Z" 
            fill={primary} 
          />
          <path 
            d="M38 20H26C24.895 20 24 20.895 24 22V42C24 43.105 24.895 44 26 44H38C39.105 44 40 43.105 40 42V22C40 20.895 39.105 20 38 20ZM36 40H28V24H36V40Z" 
            fill={secondary} 
          />
          <path 
            d="M46 16H42C40.895 16 40 16.895 40 18V22C40 23.105 40.895 24 42 24H46C47.105 24 48 23.105 48 22V18C48 16.895 47.105 16 46 16Z" 
            fill={secondary} 
          />
          <path 
            d="M46 28H42C40.895 28 40 28.895 40 30V46C40 47.105 40.895 48 42 48H46C47.105 48 48 47.105 48 46V30C48 28.895 47.105 28 46 28Z" 
            fill={secondary} 
          />
          <path 
            d="M22 28H18C16.895 28 16 28.895 16 30V46C16 47.105 16.895 48 18 48H22C23.105 48 24 47.105 24 46V30C24 28.895 23.105 28 22 28Z" 
            fill={secondary} 
          />
        </svg>
      </div>
      {includeText && (
        <div className={`font-bold tracking-tight ${fontSize}`}>
          <span style={{ color: primary }}>Klout</span>
          <span style={{ color: secondary }} className="font-light">.soccer</span>
        </div>
      )}
    </div>
  );
}