import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt = '', 
  height, // This will override state height if provided
  format = 'webp', 
  className = '', 
  aspectRatio = 'auto', 
  additionalStyles = {} 
}) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 480) {
        setDimensions({ width: 300, height: 180 }); // Mobile
      } else if (windowWidth < 768) {
        setDimensions({ width: 500, height: 300 }); // Tablet
      } else {
        setDimensions({ width: 800, height: 400 }); // Desktop
      }
    };

    handleResize(); // Initialize on load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!src) return null;

  const finalHeight = height || dimensions.height;
  const params = new URLSearchParams();
  params.append('width', dimensions.width);
  params.append('height', finalHeight);
  if (format) params.append('format', format);

  const optimizedSrc = src.includes('?') 
    ? `${src}&${params.toString()}`
    : `${src}?${params.toString()}`;

  const aspectStyle = aspectRatio === 'auto' ? {} : { aspectRatio };

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`object-cover ${className}`}
      style={{ ...aspectStyle, ...additionalStyles }}
      loading="lazy"
      decoding="async"
    />
  );
};

export default OptimizedImage;
