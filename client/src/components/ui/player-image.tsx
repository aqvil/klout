import { useState, useEffect } from 'react';

interface PlayerImageProps {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
}

export function PlayerImage({ src, alt, className = "", size = 100 }: PlayerImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  
  // If no source is provided, use avatar generator
  useEffect(() => {
    if (!imgSrc) {
      setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=${size}&background=random`);
    }
  }, [imgSrc, alt, size]);
  
  const handleError = () => {
    // Fall back to a placeholder if the image fails to load
    setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=${size}&background=random`);
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}