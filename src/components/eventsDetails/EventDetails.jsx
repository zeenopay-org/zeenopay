import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import QrCard from "../contestentDetails/QrCard.jsx";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);
  const [passingId, setPassingId] = useState("");

  useEffect(() => {
    setPassingId(id);
  }, [id]); // Runs only when id changes

  const {
    getAllContestants,
    loading,
    contestants,
    getEvent,
    event,
    paymentCurrency,
    getPaymentCurrency,
  } = useContext(EventContext);

  // Fetching currentCurrency
  useEffect(() => {
    getPaymentCurrency();
  }, [getPaymentCurrency]);

  useEffect(() => {
    getAllContestants(id);
  }, [getAllContestants, id]);

  useEffect(() => {
    getEvent(id);
  }, [getEvent, id]);

  if (!contestants) {
    return <p className="text-center text-red-500">Event not found!</p>;
  }

  const handleClick = (id, passingId) => {
    console.log("Scrolling to top..."); // Debugging line
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(`/contestant-details/${id}`, { state: { passingId } });
  };

  const handleQR = () => {
    console.log("Scrolling to top for QR..."); // Debugging line
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPop(true);
  };

  const handleX = () => {
    setPop(false);
  };

  return (
    <div className="bg-customBlue max-w-full py-8 px-4 flex flex-col items-center pb-20">
      {pop && <QrCard handleX={handleX} />}
      <>
        <div
          className={`w-full ${pop ? "blur-md pointer-events-none" : ""} flex justify-center items-center w-full`}
        >
          {loading ? (
            <div className="w-full max-w-[90%] h-auto md:h-[500px] bg-gray-300 animate-pulse rounded-2xl mb-6"></div>
          ) : (
            <img
              src={event.img}
              alt={event.title}
              className="w-full max-w-[90%] h-auto md:h-[500px] rounded-2xl mb-6"
            />
          )}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
          {loading ? (
            <div className="h-8 w-1/3 bg-gray-700 animate-pulse mb-2"></div>
          ) : (
            event.title
          )}
        </h1>
        <p className="text-white mt-2 text-center text-sm md:text-lg">
          {loading ? (
            <div className="h-4 w-1/4 bg-gray-300 animate-pulse"></div>
          ) : (
            "Voting close!"
          )}
        </p>

        <div
          className={` w-full ${pop ? "blur-md pointer-events-none" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-[90%]`}
        >
          {loading
            ? Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="relative bg-customDarkBlue rounded-2xl shadow-lg p-3 flex flex-col items-center text-center"
                  >
                    <div className="absolute top-1 left-1 transform -translate-x-[20%] -translate-y-[12.5%] bg-[#000B44] text-white h-16 w-12 md:h-24 md:w-20 text-[28px] md:text-[36px] px-3 py-1 sm:px-4 sm:py-2 rounded-br-full rounded-tl-2xl shadow-lg shadow-blue-300">
                      {/* Placeholder for loading */}
                    </div>
                    <div className="w-full h-60 lg:h-[300px] md:h-60 bg-gray-700 animate-pulse rounded-2xl mb-4"></div>
                    <div className="h-6 w-3/4 bg-gray-500 animate-pulse mb-4 rounded-3xl"></div>
                    <div className="h-10 w-3/4 bg-gray-500 animate-pulse rounded-3xl"></div>
                  </div>
                ))
            : contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className="relative bg-customDarkBlue rounded-2xl shadow-lg p-3 flex flex-col items-center text-center"
                >
                  {/* Added Miscellaneous Data Display */}
                  {contestant?.misc_kv && (
                    <div className="absolute top-2 left-3 transform -translate-x-[20%] -translate-y-[12.5%] bg-[#009BE2] text-white h-16 w-12 md:h-24 md:w-20 text-[28px] md:text-[36px] px-3 py-1 sm:px-4 sm:py-2 rounded-br-full rounded-tl-2xl ">
                      {contestant.misc_kv}
                    </div>
                  )}
                  <img
                    src={contestant.avatar}
                    alt={contestant.name}
                    className="w-full h-60 lg:h-[300px] md:h-60 object-cover rounded-2xl mb-4"
                  />

                  <h2 className="text-base md:text-lg text-white font-semibold mb-4">
                    {contestant.name}
                  </h2>

                  {paymentCurrency?.cc?.toLowerCase() === "np" ? (
                    <div className="flex justify-between w-full gap-6">
                      <button
                        className="bg-[#003A75]  w-[55%] text-white px-4 py-2 rounded-3xl font-medium hover:bg-gray-600"
                        onClick={handleQR}
                      >
                        Get QR
                      </button>
                      <button
                        className="bg-[#003A75] hover:bg-[#00255C] w-[55%] text-white px-4 py-2 rounded-3xl font-medium hover:bg-gray-600"
                        onClick={() => handleClick(contestant.id)}
                      >
                        Vote Now
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-[#003A75] hover:bg-[#00255C] w-[90%] text-white px-6 py-2 rounded-3xl font-medium hover:bg-gray-600"
                      onClick={() => handleClick(contestant.id, passingId)}
                    >
                      Vote Now
                    </button>
                  )}
                </div>
              ))}
        </div>
      </>
    </div>
  );
}

export default EventDetails;
