import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EventContext } from "../../EventProvider";

function OngoingEvents() {
  const navigate = useNavigate();
  const { events, loading, getAllEvents } = useContext(EventContext);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-customBlue px-4 sm:px-8 md:px-16 lg:px-[148px] ">
      <h2 className="text-white text-2xl font-semibold text-center mb-8">
        Ongoing Voting Events
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-customDarkBlue animate-pulse rounded-3xl shadow-md flex flex-col"
                style={{ height: "400px" }} // Reserve fixed height for loading state
              >
                <div className="w-full aspect-[4/3] bg-gray-700 rounded-t-3xl"></div>
                <div className="flex flex-col p-4 flex-grow">
                  <div className="h-4 bg-gray-500 rounded w-3/5 mb-2"></div>
                  <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                  <div className="flex gap-20 mt-auto">
                    <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
                    <div className="h-6 bg-gray-500 w-[40%] rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))
          : [...events].reverse().map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col cursor-pointer"
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
                <div className="w-full aspect-[4/3] relative">
                  <img
                    src={event.img ? `${event.img}?format=webp` : ""}
                    alt={event.title}
                    width="400"
                    height="300"
                    className="absolute inset-0 w-full h-full object-cover p-2 rounded-3xl"
                    loading="lazy"
                    style={{
                      display: "block", // Prevent layout shifts while the image loads
                    }}
                  />
                </div>
                <div className="flex flex-col px-4 pt-2 pb-4 flex-grow">
                  <h3 className="text-sm md:text-[12px] font-semibold">
                    {event.title}
                  </h3>
                  <p className="text-xs md:text-[10px] text-gray-300 mt-1 flex-grow">
                    {event.desc}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="flex items-center text-xs text-gray-100">
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
