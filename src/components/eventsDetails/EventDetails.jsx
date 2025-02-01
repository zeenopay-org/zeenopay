import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";


function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getAllContestants, loading, contestants, getEvent, event } =
    useContext(EventContext);

  useEffect(() => {
    getAllContestants(id); // Fetch events when the component mounts
  }, [getAllContestants, id]);

  useEffect(() => {
    getEvent(id); // Fetch events when the component mounts
  }, [getEvent, id]);

  console.log(contestants);

  if (!contestants) {
    return <p className="text-center text-red-500">Event not found!</p>;
  }

  const handleClick = (id) => {
    navigate(`/contestant-details/${id}`);
  };
  return (
    <div className="bg-customBlue max-w-full py-8 px-4 flex flex-col items-center pb-20">
      {/* Banner Image and Details */}
      <div className="flex justify-center items-center w-full">
        <img
          src={event.img}
          alt={event.title}
          className="w-full max-w-[90%] h-auto md:h-[500px] rounded-2xl mb-6"
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
        {event.title}
      </h1>
      <p className="text-white mt-2 text-center text-sm md:text-lg">
        Voting close!
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-[90%]">
        {contestants.map((card) => (
          <div
            key={card.id}
            className="bg-customDarkBlue rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <img
              src={card.avatar}
              alt={card.name}
              className="w-full h-full sm:h-[250p object-cove rounded-2xl mb-4"
            />
            <h2 className="text-base md:text-lg text-white font-semibold mb-4">
              {card.name}
            </h2>
            <button
              className="bg-gray-700 w-full text-white px-6 py-2 rounded-3xl font-medium hover:bg-gray-600"
              onClick={() => handleClick(card.id)}
            >
              Vote Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventDetails;
