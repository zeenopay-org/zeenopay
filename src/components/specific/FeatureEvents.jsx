import React, { useContext, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../../EventProvider";

function FeatureEvents() {
  const navigate = useNavigate();

  const { events, loading, getAllEvents } = useContext(EventContext);

  useEffect(() => {
    getAllEvents(); // Fetch events when the component mounts
  }, [getAllEvents]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
    handleScrollToTop();
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "35px" },
      },
    ],
  };

  return (
    <div className="bg-customBlue px-4 sm:px-8 md:px-16 lg:px-32 pb-[54px]">
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        Feature Events
      </h2>
      <Slider {...settings}>
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleCardClick(event.id)}
            className="bg-customDarkBlue text-white  rounded-3xl shadow-lg overflow-hidden cursor-pointer flex flex-col justify-between w-[90px] flex-shrink-0"
            style={{ margin: "0 8px" }}
          >
            <img
              src={event.img}
              alt={event.title}
              className="w-full p-2 rounded-3xl h-52 lg:h-60 md:h-68 object-fill"
            />
            <div className="pl-4 pr-4 flex flex-col flex-grow">
              <h3 className="text-lg md:text-lg font-semibold">
                {event.title}
              </h3>
              <p className="text-xs text-gray-300 mt-2 flex-grow">
                {event.org}
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
                  {event.finaldate}
                </p>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-sm px-3 py-[6px] my-4 rounded-full">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default FeatureEvents;
