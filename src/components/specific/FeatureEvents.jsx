import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EventContext } from "../../EventProvider";

function FeatureEvents() {
  const navigate = useNavigate();
  const { events, loading, getAllEvents } = useContext(EventContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
    handleScrollToTop();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < events.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const touchDifference = touchStart - touchEnd;
    if (touchDifference > 50) {
      handleNext();
    } else if (touchDifference < -50) {
      handlePrev();
    }
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  return (
    <div className="bg-customBlue pt-3 md:pt-[3px] px-4 sm:px-8 md:px-16 lg:px-32">
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
          className="flex transition-transform duration-500 ease-in-out ml-20 mr-20 mt-8 mb-10"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            marginLeft: currentSlide === 0 ? "0" : "16px",
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4"
                >
                  <div className="bg-customDarkBlue animate-pulse rounded-3xl shadow-lg flex flex-col">
                    <div className="w-full h-52 lg:h-60 md:h-68 bg-gray-700 rounded-3xl"></div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="h-4 bg-gray-500 rounded w-3/5 mb-2"></div>
                      <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                      <div className="flex gap-20">
                        <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                        <div className="h-6 bg-gray-500 rounded w-[40%] rounded-2xl mt-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 ml-4 ${event === 0 ? "p-[-2]" : "pl-1"}`}
                >
                  <div
                    onClick={() => handleCardClick(event.id)}
                    className="bg-customDarkBlue text-white rounded-3xl shadow-lg overflow-hidden cursor-pointer flex flex-col"
                  >
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full p-2 rounded-3xl h-52 lg:h-60 md:h-68 object-cover"
                    />
                    <div className="pl-4 pr-4 flex flex-col flex-grow">
                      <h3 className="text-lg md:text-lg font-semibold">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-2 flex-grow">
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
      </div>
    </div>
  );
}

export default FeatureEvents;
