import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import QrCard from "../contestentDetails/QrCard.jsx";
import CountdownTimer from "../contestentDetails/CountdownTimer.jsx";
import { FiFilter, FiChevronDown, FiX } from "react-icons/fi";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);
  const [qrId, setQrId] = useState(0);
  const [passingId, setPassingId] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [temp, setTemp] = useState(null);
  const [skeletonDelay, setSkeletonDelay] = useState(true);
  const [sortOption, setSortOption] = useState("number");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    paid: false,
    free: false,
    verified: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setSkeletonDelay(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const handleClick = (id, passingId) => {
    navigate(`/contestant-details/${id}`, { state: { passingId } });
  };

  const handleQR = (id) => {
    handleScrollToTop();
    setQrId(id);
    setPop(true);
  };

  const handleX = () => {
    setPop(false);
  };

  const handleScrollToTop = () => {
    const scrollElement =
      document.scrollingElement || document.documentElement || document.body;
    scrollElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFilter = (filterName) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      paid: false,
      free: false,
      verified: false
    });
  };

  const filteredContestants = contestants.filter(contestant => {
    if (!activeFilters.paid && !activeFilters.free && !activeFilters.verified) {
      return true;
    }
    
    return (
      (activeFilters.paid && contestant.isPaid) ||
      (activeFilters.free && !contestant.isPaid) ||
      (activeFilters.verified && contestant.isVerified)
    );
  });

  return (
    <div className="bg-customBlue w-full min-h-screen flex flex-col items-center pb-20">
      <div className="w-full max-w-[1920px] px-4 py-8 md:-mt-20 flex flex-col items-center">
        {pop && <QrCard handleX={handleX} qrid={qrId} />}

        <div className="relative w-full aspect-[16/9] flex flex-col items-center justify-center mb-6">
          {loading || skeletonDelay ? (
            <div className="w-[90%] h-[70%] bg-gray-600 animate-pulse rounded-2xl"></div>
          ) : (
            <>
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-full md:w-[90%] md:h-[70%] object-fit rounded-2xl"
              />
              {event.misc_kv && (
                <div className="absolute -bottom-10 md:bottom-6 lg:bottom-14 left-1/2 transform -translate-x-1/2 h-28 w-28 md:h-40 md:w-40 aspect-square">
                  <img
                    src={event.misc_kv}
                    alt=""
                    className="h-full w-full rounded-full border-4 border-white object-cover"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-full flex flex-col items-center justify-center min-h-[4rem] md:min-h-[5rem]">
          <h1 className="text-2xl md:text-4xl mt-10 md:mt-0 font-bold text-white text-center">
            {loading ? (
              <div className="h-8 w-1/3 bg-gray-700 animate-pulse mb-2 mx-auto"></div>
            ) : (
              event.title
            )}
          </h1>
        </div>

        <div className="text-white mt-2 text-center text-sm md:text-lg min-h-[4.5rem] flex flex-col justify-center">
          {loading ? (
            <div className="space-y-2 w-full">
              <div className="h-5 w-3/4 max-w-xs mx-auto bg-gray-300/50 rounded animate-pulse"></div>
              <div className="h-4 w-1/3 max-w-xs mx-auto bg-gray-300/50 rounded animate-pulse"></div>
            </div>
          ) : currentDate > eventFinalDate ? (
            <p className="py-2">Voting Closed!</p>
          ) : (
            <div className="space-y-1">
              <CountdownTimer endTime={finalDate} />
              <p className="text-white/80">Voting Open</p>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mt-6 w-full max-w-[90%]">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium border border-blue-600 transition duration-200"
            >
              <FiFilter className="text-lg" />
              
              <FiChevronDown className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
               
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    setSortOption("misc_kv");
                    setShowSortDropdown(false);
                  }}
                >
                   Number
                  {sortOption === "misc_kv" && <span className="text-blue-500">✓</span>}
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    setSortOption("name");
                    setShowSortDropdown(false);
                  }}
                >
                 Name
                  {sortOption === "name" && <span className="text-blue-500">✓</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contestants Grid */}
        <div
          className={`w-full ${
            pop ? "blur-md pointer-events-none" : ""
          } grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 w-full max-w-[90%]`}
        >
          {loading
            ? Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="relative bg-customDarkBlue rounded-2xl shadow-lg p-3 flex flex-col items-center text-center min-h-[450px]"
                  >
                    <div className="absolute top-5 left-6 md:top-6 md:left-7 transform -translate-x-[20%] -translate-y-[12.5%] bg-[#000B44] text-white h-16 w-12 md:h-24 md:w-20 text-[28px] md:text-[36px] px-3 py-1 sm:px-4 sm:py-2 rounded-br-full rounded-tl-lg shadow-lg shadow-blue-300"></div>
                    <div className="w-full h-60 lg:h-[300px] md:h-60 bg-gray-700 animate-pulse rounded-2xl mb-4"></div>
                    <div className="h-6 w-3/4 bg-gray-500 animate-pulse mb-4 rounded-3xl"></div>
                    <div className="h-10 w-3/4 bg-gray-500 animate-pulse rounded-3xl"></div>
                  </div>
                ))
            : [...filteredContestants]
                .sort((a, b) => {
                  if (sortOption === "name") {
                    const nameCompare = a.name.localeCompare(b.name);
                    if (nameCompare !== 0) return nameCompare;
                    return (a.misc_kv || 0) - (b.misc_kv || 0);
                  } else if (sortOption === "misc_kv") {
                    return (a.misc_kv || 0) - (b.misc_kv || 0);
                  }
                  return 0;
                })
                .map((contestant) => (
                  <div
                    key={contestant.id}
                    className="relative bg-customDarkBlue rounded-2xl shadow-lg p-3 flex flex-col items-center text-center aspect-square min-h-[250px]"
                  >
                    {contestant.misc_kv && (
                      <div
                        className="absolute top-5 left-[21px] md:top-6 md:left-7 transform -translate-x-[20%] -translate-y-[12.5%] 
                        bg-[#009BE2] text-white h-16 w-12 md:h-24 md:w-20 
                        text-[20px] md:text-[32px] flex items-center justify-center 
                        rounded-tr-2xl rounded-tl-2xl rounded-br-full"
                      >
                        {contestant.misc_kv}
                      </div>
                    )}
                    <div className="w-full h-full rounded-2xl mb-4 overflow-hidden">
                      <img
                        src={contestant.avatar}
                        alt={contestant.name}
                        onClick={() => handleClick(contestant.id)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-base md:text-lg text-white font-semibold mb-4">
                      {contestant.name}
                    </h2>
                    {["np", "in"].includes(paymentCurrency?.cc?.toLowerCase()) ? (
                      <div className="flex justify-between w-full gap-6">
                        <button
                          className="bg-[#003A75] w-[55%] text-white px-4 py-2 rounded-3xl font-medium hover:bg-gray-600"
                          onClick={() => handleQR(contestant.id)}
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
      </div>
    </div>
  );
}

export default EventDetails;