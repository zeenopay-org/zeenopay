import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EventContext } from "../../EventProvider";

function FeatureEvents() {
  const navigate = useNavigate();
  const { events, loading, getAllEvents } = useContext(EventContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [autoSlide, setAutoSlide] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getAllEvents();
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [getAllEvents]);

  useEffect(() => {
    if (events.length > 0) {
      events.forEach(event => {
        if (event.img) {
          const img = new Image();
          img.src = `${event.img}?format=webp&width=800`;
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [event.id]: true }));
          };
        }
      });
    }
  }, [events]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const shouldSlide = useCallback(() => {
    if (isMobile) return events.length > 1;
    return events.length > 3;
  }, [events.length, isMobile]);

  const handlePrev = useCallback(() => {
    if (!shouldSlide()) return;
    setCurrentSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1));
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 2000);
  }, [events.length, shouldSlide]);

  const handleNext = useCallback(() => {
    if (!shouldSlide()) return;
    setCurrentSlide((prev) => (prev >= events.length - 1 ? 0 : prev + 1));
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 2000);
  }, [events.length, shouldSlide]);

  const handleTouchStart = (e) => {
    if (!shouldSlide()) return;
    setTouchStart(e.targetTouches[0].clientX);
    setAutoSlide(false);
  };

  const handleTouchMove = (e) => {
    if (!shouldSlide()) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!shouldSlide()) return;
    const threshold = 50;
    if (touchStart - touchEnd > threshold) handleNext();
    if (touchEnd - touchStart > threshold) handlePrev();
    setTimeout(() => setAutoSlide(true), 10000);
  };

  useEffect(() => {
    if (!autoSlide || !shouldSlide()) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoSlide, handleNext, shouldSlide]);

  const getImageWidth = () => {
    if (typeof window === 'undefined') return 400;
    if (window.innerWidth < 640) return 300;
    if (window.innerWidth < 768) return 350;
    return 400;
  };

  const getSlideWidth = () => {
    if (isMobile) return '100%';
    return '33.33%';
  };

  return (
    <div className="bg-customBlue pt-3 md:pt-[3px] px-4 sm:px-0 md:px-20 lg:px-40">
      <h2 className="text-white text-2xl font-semibold justify-start text-center">
        Featured Events
      </h2>
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out ml-0 mr-16 mt-8 mb-10"
          style={{
            transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.33)}%)`,
            marginLeft: (shouldSlide() && currentSlide === 0) ? "0" : "16px",
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4"
                  style={{ width: getSlideWidth() }}
                >
                  <div className="bg-customDarkBlue animate-pulse rounded-3xl shadow-lg flex flex-col h-full">
                    <div
                      className="w-full bg-gray-700 rounded-3xl"
                      style={{
                        paddingTop: "56.25%", 
                        position: "relative"
                      }}
                    ></div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="h-4 bg-gray-500 rounded w-3/5 mb-2"></div>
                      <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                      <div className="flex gap-20 mt-auto">
                        <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                        <div className="h-6 bg-gray-500 rounded w-[40%] rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : [...events].reverse().map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-1/3'} px-4`}
                  style={{ width: getSlideWidth() }}
                >
                  <div
                    onClick={() => handleCardClick(event.id)}
                    className="bg-customDarkBlue text-white rounded-3xl shadow-lg overflow-hidden cursor-pointer flex flex-col h-full"
                  >
                    <div className="w-full p-2">
                      <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-900 to-black" style={{ paddingTop: "56.25%", position: "relative" }}>
                        {loadedImages[event.id] ? (
                          <>
                            <img
                              src={
                                event.img
                                  ? `${event.img}?format=webp&width=${getImageWidth() * 2}`
                                  : "/placeholder-event.jpg"
                              }
                              alt={event.title}
                              className="absolute top-0 left-0 w-full h-full rounded-2xl"
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-event.jpg";
                              }}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                          </>
                        ) : (
                          <div 
                            className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gray-700 animate-pulse"
                          />
                        )}
                      </div>
                    </div>
                    <div className="pl-4 pr-4 flex flex-col flex-grow">
                      <h3 className="text-sm md:text-[14px] font-semibold line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-2 flex-grow line-clamp-2">
                        {event.org}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="flex items-center text-xs md:text-xs text-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDate(event.finaldate)}
                        </p>
                        <button className="bg-[#003A75] hover:bg-[#005190] text-white text-xs md:text-xm px-3 py-[6px] my-4 rounded-full">
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
        {shouldSlide() && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#003A75] text-white rounded-full hover:bg-[#005190] disabled:opacity-50"
              disabled={currentSlide === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#003A75] text-white rounded-full hover:bg-[#005190] disabled:opacity-50"
              disabled={isMobile ? currentSlide === events.length - 1 : currentSlide === Math.floor(events.length / 3)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FeatureEvents;