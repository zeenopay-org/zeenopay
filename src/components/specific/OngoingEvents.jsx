import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EventContext } from "../../EventProvider";

function OngoingEvents() {
  const navigate = useNavigate();
  const { events, loading, getAllEvents,  } = useContext(EventContext);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-customBlue max-h-full px-[17px] sm:px-8 md:px-16 lg:px-[148px] lg:pb-[54px] pb-[46px]">
      <h2 className="text-white text-2xl font-semibold text-center mb-8">
        Ongoing Events
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:m-0 m-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {loading ?
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-customDarkBlue animate-pulse rounded-3xl shadow-md flex flex-col"
              >
                <div className="w-full h-40 md:h-44 lg:h-48 bg-gray-700 rounded-3xl"></div>
                <div className="flex flex-col p-4 flex-grow">
                  <div className="h-4 bg-gray-500 rounded w-3/5 mb-2"></div>
                  <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                  <div className="flex gap-20">
                    <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                    <div className="h-6 bg-gray-500  w-[40%] rounded-2xl mt-auto"></div>
                  </div>
                </div>
              </div>
            ))
          : // Event Cards with Scroll Animation
            events.map((event, index) => (
              <motion.div
                key={index}
                className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0"
                onClick={() => handleCardClick(event.id)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full p-2 rounded-3xl h-52 md:h-44 lg:h-44 object-cover"
                />
                <div className="flex flex-col pl-4 pr-4 flex-grow">
                  <h3 className="text-sm md:text-[12px] font-semibold">
                    {event.title}
                  </h3>
                  <p className="text-xs md:text-[10px] text-gray-300 mt-1 flex-grow">
                    {event.desc}
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
                    <button className="bg-[#003A75] hover:bg-[#005190] text-white text-xs px-3 py-[6px] my-4 rounded-full">
                      Get Started
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
}

export default OngoingEvents;
