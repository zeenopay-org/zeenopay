import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../../EventProvider";

function OngoingEvents() {
  const navigate = useNavigate();

  const { events, loading, getAllEvents } = useContext(EventContext);

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
    <div className="bg-customBlue px-8 sm:px-8 md:px-16 lg:px-32 lg:pb-[54px] pb-[46px] ">
      <h2 className="text-white  text-3xl font-bold text-center mb-8">
        Ongoing Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            onClick={() => {
              handleCardClick(event.id);
            }}
            className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0"
          >
            <img
              src={event.img}
              alt={event.title}
              className="w-full p-2 rounded-3xl h-40 md:h-44 lg:h-48 object-cover"
            />
            <div className="flex flex-col pl-4 pr-4 flex-grow">
              <h3 className="text-sm md:text-[16px] font-semibold">
                {event.title}
              </h3>
              <p className="text-xs md:text-[10px] text-gray-300 mt-1 flex-grow">
                {event.desc}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <p className="flex items-center text-xs md:text-xsm text-gray-100">
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
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-[6px] my-4 rounded-full">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OngoingEvents;
