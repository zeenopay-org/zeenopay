import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import QrCard from "../contestentDetails/QrCard.jsx";
import CountdownTimer from "../contestentDetails/CountdownTimer.jsx";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);
  const [qrId, setQrId] = useState(0);
  const [passingId, setPassingId] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [temp, setTemp] = useState(null);
  
   useEffect(() => {
      setTimeout(() => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
          window.scrollTo(0, 0);
        }
      }, 100);
    }, []);
    

  useEffect(() => {
    setPassingId(id);
  }, [id]);

  const {
    getAllContestants,
    loading,
    contestants,
    getEvent,
    event,
    paymentCurrency,
    getPaymentCurrency,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentCurrency();
  }, [getPaymentCurrency]);

  useEffect(() => {
    getAllContestants(id);
  }, [getAllContestants, id]);

  useEffect(() => {
    getEvent(id);
  }, [getEvent, id]);

  useEffect(() => {
    const savedEvent = localStorage.getItem("event");

    if (savedEvent) {
      const parsedEvent = JSON.parse(savedEvent);
      setTemp(parsedEvent);
      setFinalDate(parsedEvent.finaldate);
    } else {
      getEvent(passingId);
    }
  }, [passingId, getEvent]);

  const eventFinalDate = new Date(event.finaldate);
  const currentDate = new Date();

  if (!contestants) {
    return <p className="text-center text-red-500">Event not found!</p>;
  }

  // handle voteNow button click
  const handleClick = (id, passingId) => {
    navigate(`/contestant-details/${id}`, { state: { passingId } });
  };

  // open QR form (for nepal only)
  const handleQR = (id) => {
    handleScrollToTop();
    handleScrollToTop();
    setQrId(id); // Set the qrId
    setPop(true);
  };
  const handleX = () => {
    console.log("handleX clicked");
    setPop(false);
  };
  const handleScrollToTop = () => {
    console.log("Scrolling to top via a function handleScrollToTop");

    const scrollElement =
      document.scrollingElement || document.documentElement || document.body;

    scrollElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-customBlue max-w-full py-8 px-4 flex flex-col items-center pb-20">
      <>
        {pop && (
          <>
            <QrCard handleX={handleX} qrid={qrId} />
          </>
        )}

        <div
          className={`w-full ${pop ? "blur-md pointer-events-none" : ""} flex justify-center items-center w-full`}
        >
          {loading ? (
            <div className="w-full max-w-[90%] h-auto md:h-[500px] bg-gray-300 animate-pulse rounded-2xl mb-6"></div>
          ) : (
            <div className="relative flex flex-col w-full h-full items-center justify-center">
              <img
                src={event.img}
                alt={event.title}
                className="w-full max-w-[90%] h-auto md:h-[500px] rounded-2xl mb-6"
                loading="lazy"
                onError={() => console.log("Avatar failed to load")}
              />
              {event.misc_kv ? (
                <img
                  src={event.misc_kv}
                  alt=""
                  className="absolute -bottom-10 md:-bottom-4 left-1/2 transform -translate-x-1/2 h-28 w-28 md:h-40 md:w-40 rounded-full border-4 border-white object-fit"
                />
              ) : null}{" "}
            </div>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl mt-14 mg:mt-10 font-bold text-white text-center">
          {loading ? (
            <div className="h-8 w-1/3 bg-gray-700 animate-pulse mb-2"></div>
          ) : (
            event.title
          )}
        </h1>
        <div className="text-white mt-2 text-center text-sm md:text-lg">
          {loading ? (
            <div className="h-4 w-1/4 bg-gray-300 animate-pulse"></div>
          ) : currentDate > eventFinalDate ? (
            <p>Voting Close!</p>
          ) : (
            <>
              <CountdownTimer endTime={finalDate} />
              <p>Voting Open.</p>
            </>
          )}
        </div>

        <div
          className={` w-full ${pop ? "blur-md pointer-events-none" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 w-full max-w-[90%]`}
        >
          {loading
            ? Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="relative bg-customDarkBlue rounded-2xl shadow-lg p-3 flex flex-col items-center text-center"
                  >
                    <div className="absolute top-5 left-6 md:top-6 md:left-7 transform -translate-x-[20%] -translate-y-[12.5%] bg-[#000B44] text-white h-16 w-12 md:h-24 md:w-20 text-[28px] md:text-[36px] px-3 py-1 sm:px-4 sm:py-2 rounded-br-full rounded-tl-lg shadow-lg shadow-blue-300"></div>
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
                  {contestant.misc_kv ? (
                    <div
                      className="absolute top-5 left-[21px] md:top-6 md:left-7 transform -translate-x-[20%] -translate-y-[12.5%] 
                    bg-[#009BE2] text-white h-16 w-12 md:h-24 md:w-20 
                    text-[20px] md:text-[32px] flex items-center justify-center 
                    rounded-tr-2xl rounded-tl-2xl rounded-br-full"
                    >
                      {contestant.misc_kv}
                    </div>
                  ) : null}
                  <img
                    src={contestant.avatar}
                    alt={contestant.name}
                    onClick={() => handleClick(contestant.id)}
                    className="w-full h-60 lg:h-[300px] md:h-60 object-cover rounded-2xl mb-4"
                    loading="lazy"
                    onError={() => console.log("Avatar failed to load")}
                  />
                  <h2 className="text-base md:text-lg text-white font-semibold mb-4">
                    {contestant.name}
                  </h2>
                  {paymentCurrency?.cc?.toLowerCase() === "np" ? (
                    <div className="flex justify-between w-full gap-6">
                      <button
                        className="bg-[#003A75]  w-[55%] text-white px-4 py-2 rounded-3xl font-medium hover:bg-gray-600"
                        onClick={() => {
                          handleQR(contestant.id);
                        }}
                      >
                        QR Vote
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
