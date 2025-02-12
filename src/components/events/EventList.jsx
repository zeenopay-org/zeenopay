import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../../EventProvider";

function EventList() {
  const navigate = useNavigate();
  const { onGoingEvents, loading, getAllOngoingEvents } = useContext(EventContext);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    getAllOngoingEvents();
  }, [getAllOngoingEvents]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Skeleton Loader
  const renderSkeletonLoader = () => (
    <div className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0">
      <div className="w-full p-2 rounded-3xl h-60 lg:h-60 md:h-68 bg-gray-700 animate-pulse"></div>
      <div className="pl-4 pr-4 flex flex-col flex-grow">
        <div className="h-6 w-3/4 bg-gray-500 animate-pulse mt-4"></div>
        <div className="h-4 w-5/6 bg-gray-500 animate-pulse mt-2"></div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-4 w-1/4 bg-gray-500 animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-500 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-customBlue px-4 min-h-screen sm:px-8 md:px-16 lg:px-32 py-8 md:py-12 lg:py-16">
      <h2 className="text-white text-2xl font-semibold text-center mb-8">
        Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full lg:grid-cols-3 gap-6">
        {loading ? (
          // Render skeleton loaders if loading is true
          Array(6)
            .fill()
            .map((_, index) => <div key={index}>{renderSkeletonLoader()}</div>)
        ) : (
          // Render actual event data if not loading
          onGoingEvents.map((event, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(event.id)}
              className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0"
            >
              <img
                src={event.img}
                alt={event.org}
                className="w-full p-2 rounded-3xl h-60 lg:h-60 md:h-68 object-fill"
              />
              <div className="pl-4 pr-4 flex flex-col flex-grow">
                <h3 className="text-lg md:text-lg font-semibold">
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
                  <button className="bg-[#003A75] hover:bg-[#005190] text-white text-sm md:text-sm px-3 py-[6px] my-4 rounded-full">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventList;
