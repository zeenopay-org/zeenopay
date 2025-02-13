import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { FaCaretDown } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import PaymentOption from "./PaymentOption";
import QrCard from "./QrCard.jsx";
import { FiSearch } from "react-icons/fi";
import countryCodes from "./countryCodes";
import { useRef } from "react";

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
  const [drop, setDrop] = useState(false);
  const [generateQR, setGenerateQr] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);

  const location = useLocation();
  const { passingId } = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    intentId: 0,
    name: "",
    phone: "",
    email: "",
    votes: "",
    amount: 100,
  });

  const [temp, setTemp] = useState(null);
  useEffect(() => {
    const savedEvent = localStorage.getItem("event");
    if (event) {
      setTemp(JSON.parse(savedEvent));
    } else {
      getEvent(passingId);
    }
  }, []);

  const handleButtonClick = () => {
    inputRef.current.focus();
  };

  const handleDrop = () => {
    setDrop(() => !drop);
  };

  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      setSelectedCountry(JSON.parse(savedCurrency));
    } else {
      getPaymentCurrency();
    }
  }, []);

  const [hasValue, setHasValue] = useState(!!formData.votes);

  useEffect(() => {
    const fetchContestant = async () => {
      await getContestant(id);
    };
    fetchContestant();
  }, [getContestant, id]);

  // Handle vote change
  const handleVoteChange = (value) => {
    handleButtonClick();
    const updatedVotes = Math.max(10, Math.min(15000, value));
    const calculatedAmount = updatedVotes * votePrice;

    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
      amount: calculatedAmount,
    }));
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setHasValue(value.trim() !== "");
    setFormData((prevData) => ({
      ...prevData,
      votes: value,
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (validateForm()) setpop(true);
  };

  if (loading && !pop && !generateQR) {
    return <SkeletonLoader />;
  }

  const handleQrClick = () => {
    requestAnimationFrame(() => {
      setGenerateQr(() => !generateQR);
    });
  };

  //validate form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
                  src={temp?.img}
                  className="md:w-[1300px] h-[300px] md:h-[500px] rounded-2xl mb-6 object-cover"
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
                      <img className="h-8 w-8" src="/assets/vote.png" alt="" />

                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleButtonClick}
                className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl"
              >
                +
              </button>

              <p className="mt-2 mb-2 text-sm text-gray-400">
                Min 10 votes & Max 15000 votes. One vote = Rs 10.0
              </p>
              <div className="flex max-w-[700px] flex-col items-center">
                {/* Custom Vote Input */}
                <div className="relative flex items-center w-full gap-2">
                  {/* Decrement Button */}
                  <button
                    onClick={() => {
                      handleVoteChange(formData.votes - 1);
                      setHasValue(formData.votes - 1 > 0);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl hover:bg-gray-700 transition"
                  >
                    -
                  </button>

                  {/* Input Wrapper */}
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      ref={inputRef}
                      className={`peer w-full h-12 bg-transparent text-white text-lg outline-none border border-gray-400 rounded-lg px-4 pt-5 pb-1 text-center
      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
      focus:border-blue-500 transition-all duration-300`}
                      value={formData.votes}
                      onChange={handleChange}
                      onFocus={() => setHasValue(true)}
                      onBlur={() => setHasValue(!!formData.votes)}
                      min="10"
                      max="15000"
                      placeholder=" " 
                    />
                    {/* Floating Label */}
                    <label
                      className={`absolute left-4 text-gray-400 text-lg pointer-events-none transition-all duration-300 
      ${
        hasValue || document.activeElement === inputRef.current
          ? "top-2 left-4 text-sm text-blue-500"
          : "top-1/2 -translate-y-1/2 text-lg text-gray-400"
      }`}
                    >
                      Enter your vote
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      handleVoteChange(formData.votes + 10);
                      setHasValue(true);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl hover:bg-gray-700 transition"
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
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name (Voter)"
                      className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative flex items-center border  rounded-lg p-3">
                      {/* Country Selector */}
                      <div className="relative">
                        <button
                          onClick={handleDrop}
                          className="flex items-center  rounded-lg px-3 py-2 "
                        >
                          <div className="bold px-2">
                            <FaCaretDown />
                          </div>
                          {selectedCountry?.cc && (
                            <img
                              src={`https://flagcdn.com/w40/${selectedCountry.cc.toLowerCase()}.png`}
                              alt={`${selectedCountry.name} flag`}
                              width="24"
                              className="mr-2 "
                            />
                          )}
                          {selectedCountry?.mc}
                        </button>

                        {drop && (
                          <div className="absolute mt-1 w-[300%] bg-customBlue border border-gray-300 rounded-md shadow-md">
                            {/* Search Input with Icon */}
                            <div className="relative">
                              <FiSearch
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                              />
                              <input
                                type="text"
                                placeholder="Search country..."
                                className="w-full pl-10 pr-3 py-2 border-b border-gray-300 text-white bg-customBlue focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>

                            {/* Country List */}
                            <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                              {countryCodes
                                ?.filter((country) => {
                                  if (!country || !country.name || !country.mc)
                                    return false;
                                  return (
                                    country.name
                                      .toLowerCase()
                                      .includes(
                                        searchTerm.toLowerCase().trim()
                                      ) ||
                                    country.mc
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase().trim())
                                  );
                                })
                                .map((country) => (
                                  <li
                                    key={country.cc}
                                    className="flex items-center px-3 py-2 hover:bg-customDarkBlue cursor-pointer"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setDrop(false);
                                    }}
                                  >
                                    <img
                                      src={`https://flagcdn.com/w40/${country.cc?.toLowerCase()}.png`}
                                      alt={`${country.name} flag`}
                                      width="24"
                                      className="mr-2"
                                    />
                                    {country.name} ({country.mc})
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="number"
                        name="phone"
                        placeholder="Phone (Voter)"
                        className="bg-transparent flex-grow  outline-none text-white placeholder-gray-400
                                     [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  {paymentCurrency.cc !== "np" && (
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email (Voter)"
                        className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm">{errors.email}</p>
                      )}
                    </div>
                  )}
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