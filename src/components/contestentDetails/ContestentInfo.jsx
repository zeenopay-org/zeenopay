import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { FaCoins, FaRupeeSign } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import PaymentOption from "./PaymentOption";
import QrCard from "./QrCard.jsx";

// Skeleton loader for the form
const SkeletonLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-customBlue text-white p-4">
    <div className="flex justify-center items-center w-full relative animate-pulse">
      <div className="w-full max-w-[90%] h-[500px] bg-gray-500 rounded-2xl mb-6"></div>
      <div className="absolute justify-center md:top-[410px] top-[180px] left-[10%] sm:left-[10%]">
        <div className="w-36 h-44 sm:w-[252px] sm:h-[322px] bg-gray-500 rounded-[24px] mx-auto animate-pulse"></div>
      </div>
    </div>
    <div className="mt-60 flex flex-col items-center justify-center">
      <div className="h-6 w-1/3 bg-gray-500 rounded-full mb-4"></div>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-500 w-20 h-12 rounded-lg animate-pulse"
            ></div>
          ))}
      </div>
      <div className="h-4 w-2/3 bg-gray-500 rounded-full mt-4"></div>
      <div className="mt-6 w-full max-w-md bg-[#121c3d] border border-gray-600 p-4 rounded-lg flex items-center justify-between animate-pulse">
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
        <div className="w-32 h-6 bg-gray-500 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function VotingComponent() {
  const { id } = useParams();
  const {
    event,
    getEvent,
    getContestant,
    loading,
    paymentCurrency,
    getPaymentCurrency,
  } = useContext(EventContext);

  const [pop, setpop] = useState(false);
  const [generateQR, setGenerateQr] = useState(false);

  const location = useLocation();
  const { passingId } = location.state || {};

  const [formData, setFormData] = useState({
    intentId: 0,
    name: "",
    phone: "",
    email: "",
    votes: 10,
    amount: 100,
  });

  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  useEffect(() => {
    getPaymentCurrency();
  }, []); // No dependency means it runs only once on mount

  useEffect(() => {
    if (passingId) {
      console.log("Fetching event for ID:", passingId);
      getEvent(2);
    }
  }, [passingId, getEvent]);
  console.log("current event state:" + event);

  // Fetch contestant data
  useEffect(() => {
    const fetchContestant = async () => {
      await getContestant(id);
    };
    fetchContestant();
  }, [getContestant, id]);

  // Handle vote change
  const handleVoteChange = (value) => {
    const updatedVotes = Math.max(10, Math.min(15000, value)); // Min 10, Max 15000
    const calculatedAmount = updatedVotes * votePrice;

    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
      amount: calculatedAmount,
    }));
  };

  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to initiate payment
  const handleProceedToPay = async (e) => {
    setpop(true);
  };

  if (loading && !pop && !generateQR) {
    return <SkeletonLoader />;
  }

  const handleQrClick = () => {
    requestAnimationFrame(() => {
      setGenerateQr(() => !generateQR);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-customBlue text-white p-4 pt-[46px] pb-[66px]">
      {generateQR && <QrCard handleX={handleQrClick} />}
      <div
        className={`w-full ${generateQR ? "blur-md pointer-events-none" : ""}`}
      >
        {pop ? (
          <PaymentOption formData={formData} />
        ) : (
          <>
            <div>
              <div className="relative flex justify-center items-center w-full">
                <img
                  src={event.img}
                  className="md:w-[1300px] h-[250px] md:h-[400px] rounded-2xl mb-6"
                  alt="Event Banner"
                />
                <div
                  className="absolute bottom-[-130px] left-1/2 transform -translate-x-1/2
            md:bottom-[-100px] md:left-20 md:translate-x-0
            lg:bottom-[-150px] lg:left-20 lg:translate-x-0"
                >
                  <ProfileCard handleQrClick={handleQrClick} />
                </div>
              </div>
            </div>

            <div className="mt-52 md:mt-32 flex flex-col items-center justify-center">
              <h1 className="text-xl md:text-2xl font-normal">{event.title}</h1>
              <p className="text-gray-200 mt-1">Voting Closed!</p>

              {/* Voting Options */}
              <div className="mt-6 text-center">
                <h2 className="text-lg font-normal">Select Voting Options</h2>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
                  {voteOptions.map((option) => (
                    <button
                      key={option}
                      className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                      onClick={() => handleVoteChange(option)}
                    >
                      <FaCoins />
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleVoteChange(formData.votes)}
                className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl"
              >
                +
              </button>

              <p className="mt-2 text-gray-400">
                Min 10 votes & Max 15000 votes. One vote = Rs 10.0
              </p>
              <div className="flex max-w-[700px] flex-col items-center">
                {/* Custom Vote Input */}
                <div className="mt-6 w-full flex items-center gap-4">
                  <button
                    onClick={() => handleVoteChange(formData.votes - 1)}
                    className="w-12 h-12 flex items-center  justify-center text-2xl text-white border border-gray-400 rounded-2xl"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    className="flex-grow h-12 bg-transparent text-center text-white text-lg outline-none border border-gray-400 rounded-lg px-4 
  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={formData.votes}
                    onChange={(e) => handleVoteChange(Number(e.target.value))}
                    min="10"
                    max="15000"
                    placeholder="Enter your vote"
                  />

                  <button
                    onClick={() => handleVoteChange(formData.votes + 10)}
                    className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl"
                  >
                    +
                  </button>
                </div>

                {/* Amount Section */}
                <p className="mt-4 text-normal text-gray-400">
                  Total amount:{" "}
                  <span className="text-blue-400 font-semibold border-gray-600">
                    Rs {formData.amount}
                  </span>
                </p>

                {/* Name, Phone & Email Input */}
                <div className="mt-6 w-full flex flex-col gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name (Voter)"
                    className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                    value={formData.name}
                    onChange={handleInputChange}
                  />

                  <div className="relative flex items-center border border-gray-400 rounded-lg p-3">
                    {/* Country Flag */}
                    {paymentCurrency?.cc && (
                      <img
                        src={`https://flagcdn.com/w40/${paymentCurrency.cc.toLowerCase()}.png`}
                        alt="flag"
                        width="24"
                        className="mr-2"
                      />
                    )}

                    {/* Country Code */}
                    <span className="text-white mr-2">
                      {paymentCurrency.mc}
                    </span>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone (Voter)"
                      className="bg-transparent flex-grow outline-none text-white placeholder-gray-400"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email (Voter)"
                    className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs my-2">
                  <input
                    type="checkbox"
                    id="terms"
                    defaultChecked
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="terms">
                    Noted: I hereby accept the{" "}
                    <span className="text-blue-400">Terms of Service</span> and
                    accept that payments done for voting are non-refundable.
                  </label>
                </div>
              </div>

              <button
                className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl"
                onClick={handleProceedToPay}
              >
                Proceed to Pay
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
