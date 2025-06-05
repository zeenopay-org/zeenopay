import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/HeroSlider.css";

function HeroSlider() {
  const slides = [
    { id: 1, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.17.jpeg" },
    { id: 2, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.18%20(1).jpeg" },
    { id: 3, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.18%20(2).jpeg" },
    { id: 4, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.20.jpeg" },
    { id: 5, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.19.jpeg" },
    { id: 6, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.19%20(2).jpeg" },
    { id: 7, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.19%20(1).jpeg" },
    { id: 8, icon: "https://media.zeenopay.com/WhatsApp%20Image%202025-04-23%20at%2001.23.18.jpeg" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Preload images on component mount
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.icon;
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [slide.id]: true }));
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const getSlideDimensions = () => {
    if (typeof window === 'undefined') return { height: '360px', width: '100%' };
    
    if (window.innerWidth < 500) return { height: '180px', width: '100%' };
    if (window.innerWidth < 570) return { height: '210px', width: '100%' };
    if (window.innerWidth < 640) return { height: '250px', width: '100%' };
    if (window.innerWidth < 768) return { height: '260px', width: '90%' };
    return { height: '360px', width: '100%' };
  };

  const dimensions = getSlideDimensions();

  return (
    <div
      className="slider-container bg-customBlue h-[240px] sm:h-[300px] md:h-[420px] lg:h-[500px] flex justify-center items-center px-2 sm:px-4 relative pt-2 sm:pt-4 md:pt-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-7xl relative overflow-hidden h-full">
        <div className="flex justify-center items-center w-full h-full relative">
          {slides.map((slide, index) => {
            const position =
              (index - currentSlide + slides.length) % slides.length;
            let zIndex = "z-10";
            let transform = "scale-100 translate-x-0";
            let opacity = "opacity-100";

            if (position === slides.length - 1) {
              transform = "scale-75 translate-x-[-100%]";
              opacity = "opacity-50";
              zIndex = "z-0";
            } else if (position === 1) {
              transform = "scale-75 translate-x-[100%]";
              opacity = "opacity-50";
              zIndex = "z-0";
            } else if (position !== 0) {
              opacity = "opacity-0 hidden";
            }

            return (
              <div
                key={slide.id}
                className={`absolute w-full h-[160px] sm:h-[200px] max-w-[800px] md:h-[320px] lg:h-[360px] transition-all duration-500 ease-in-out flex justify-center items-center ${transform} ${opacity} ${zIndex}`}
                style={{
                  height: dimensions.height,
                  width: dimensions.width,
                }}
              >
                <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
                  {loadedImages[slide.id] ? (
                    <img
                      src={slide.icon}
                      alt={`Slider ${slide.id}`}
                      width={800}
                      height={360}
                      className="w-full h-full object-cover"
                      
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg sm:rounded-xl"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 w-full flex justify-center gap-1.5 sm:gap-2 md:gap-3 items-center z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 transition-all duration-300 ease-in-out border border-gray-700 ${
                currentSlide === index
                  ? "bg-white scale-150 w-6 sm:w-8 md:w-8 rounded-xl shadow-lg"
                  : "bg-gray-500 rounded-full"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;