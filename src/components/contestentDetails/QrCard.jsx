import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import countryCodes from "./countryCodes";

export default function QrCode({ handleX }) {
  const { id } = useParams();
  const inputRef = useRef(null);

  const {
    event,
    getContestant,
    paymentCurrency,
    getPaymentCurrency,
    generateDynamicQr,
    generateIntentId,
    paymentUrl,
    qrLoading,
  } = useContext(EventContext);

  const [formData, setFormData] = useState({
    intentId: 0,
    name: "",
    phone: "",
    email: "",
    votes: "",
    amount: 100,
  });

  const [hasValue, setHasValue] = useState(!!formData.votes);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [inputHover, setInputHover] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [drop, setDrop] = useState(false);
  const [errors, setErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const handleButtonClick = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      setSelectedCountry(JSON.parse(savedCurrency));
    } else {
      getPaymentCurrency();
    }
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrop = () => {
    setDrop(() => !drop);
  };

  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  useEffect(() => {
    const fetchContestant = async () => {
      await getContestant(id);
    };
    fetchContestant();
  }, [getContestant, id]);

  useEffect(() => {
    if (showQRModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQRModal]);

  useEffect(() => {
    // Store original styles
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    // Disable scrolling
    document.body.style.overflow = "hidden";
    document.body.style.height = " ";

    return () => {
      // Restore original styles when component unmounts
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);
  const handleChange = (e) => {
    const value = e.target.value;
    setHasValue(value.trim() !== ""); // Update label position based on input
    setFormData((prevData) => ({
      ...prevData,
      votes: value, // Update formData
    }));
  };

  const handleVoteChange = (value) => {
    handleButtonClick();
    const updatedVotes = Math.max(0, Math.min(15000, value));
    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQR = async (e) => {
    if (validateForm()) {
      e.preventDefault();
      const { name, phone, email, votes } = formData;
      if (!name || !phone || votes < 10) {
        alert("All fields are required, and votes should be at least 10.");
        return;
      }

      const intentID = generateIntentId();
      await generateDynamicQr(intentID, calculatedAmount, name, email, phone);

      if (paymentUrl) {
        setQrCodeUrl(paymentUrl);
        setShowQRModal(true);
      }
    } else {
    }
  };

  const calculatedAmount = useMemo(
    () => (formData.votes || 0) * votePrice,
    [formData.votes]
  );

  const voteButtons = useMemo(
    () =>
      voteOptions.map((option) => (
        <button
          key={option}
          className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
          onClick={() => handleVoteChange(option)}
        >
          <img className="h-6 w-6" src="/assets/vote.png" alt="" />
          {option}
        </button>
      )),
    [voteOptions]
  );

  return (
    <div className="bg-[#01245c] flex  items-center justify-center text-white pb-10 w-full max-w-4xl rounded-2xl h-[200%] overflow-hidden">
      <div className="relative flex items-center justify-center p-2 mt-16">
        <div className=" bg-[#01245c] shadow-lg text-white rounded-2xl overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="p-4 -mt-6 md:-mt-12 ">
            <button
              onClick={handleX}
              className=" right-6 top-6 text-3xl text-customSky"
            ></button>
            <h1 className="text-xl md:text-2xl font-bold text-center">
              {event.title}
            </h1>

            <div className="mt-6 text-center">
              <h2 className="text-lg font-normal">Select Voting Options</h2>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
                {voteButtons}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleButtonClick}
                className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-2xl"
              >
                +
              </button>
            </div>

            <p className="mt-2 text-gray-400 text-center">
              Min 10 votes & Max 15000 votes. One vote = Rs 10.0
            </p>

            <div className="flex flex-col items-center mt-6">
              {/* <div className="w-full flex items-center gap-4"> */}

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
                    placeholder=" " /* Keeps label behavior intact */
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

                {/* Increment Button */}
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

              {/* </div> */}

              <p className="mt-4 text-normal text-gray-400">
                Total amount:{" "}
                <span className="text-blue-400 font-semibold">
                  Rs {calculatedAmount}
                </span>
              </p>

              <div className="mt-6 w-full flex flex-col gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name (Voter)"
                    className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                    value={formData.name}
                    onChange={handleInputChange}
                    min="10"
                    max="15000"
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
                          <div className="relative">
                            <FiSearch
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <input
                              type="text"
                              placeholder="Enter 10-digit number..."
                              className="w-full pl-10 pr-3 py-2 border-b border-gray-300 text-white bg-customBlue focus:outline-none"
                              value={searchTerm}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                  setSearchTerm(value);
                                }
                              }}
                            />
                          </div>

                          {/* Country List */}
                          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                            {countryCodes
                              ?.filter((country) => {
                                if (!country || !country?.name || !country?.mc)
                                  return false;
                                return (
                                  country?.name
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
                                    src={`https://flagcdn.com/w40/${country?.cc?.toLowerCase()}.png`}
                                    alt={`${country?.name} flag`}
                                    width="24"
                                    className="mr-2"
                                  />
                                  {country?.name} ({country?.mc})
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
                      className="bg-transparent ml-5 md:ml-0 flex-grow outline-none text-white placeholder-gray-400
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

                <div>
                  {/* <input
                    type="email"
                    name="email"
                    placeholder="Email (Voter)"
                    className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
                    value={formData.email}
                    onChange={handleInputChange}
                  /> */}
                  {/* {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )} */}
                </div>
              </div>
            </div>

            <div className="flex item-center justify-center ">
              <button
                className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl w-28 flex justify-center items-center"
                onClick={handleQR}
                disabled={qrLoading}
              >
                {qrLoading ? (
                  <div className="w-5 h-5 border-2 border-customDarkBlue border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Get QR"
                )}
              </button>
            </div>
          </div>
        </div>

        {showQRModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black mt-14 bg-opacity-40">
            <div className="bg-customBlue p-6 rounded-lg text-center w-[26rem] border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Scan through Mobile Banking Apps, Esewa, Khalti and all major
                wallets
              </h2>
              <div className="bg-customDarkBlue p-4 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto rounded-lg border border-gray-500"
                  style={{ width: "300px", height: "300px" }}
                />
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <p className="text-red-500 ml-4 font-semibold">Powered by</p>
                  <img
                    src="/assets/Fonepay_Logo.png"
                    className="w-28 h-8"
                    alt="FonePay Logo"
                  />
                </div>
              </div>

              <div className="flex mt-2 text-white pt-4">
                <p className="ml-6 text-md">TOTAL AMOUNT NPR.</p>
                <div className="flex justify-end w-44">
                  <span className="ml-10 bg-[#00255c] opacity-80 h-8 w-20 rounded-lg text-green-600 text-xl font-bold">
                    {calculatedAmount}
                  </span>
                </div>
              </div>
              <p className="text-xs mt-4">
                <span className="text-red-500"> NOTE:</span> I hereby accept the
                Terms of Services and acknowledge that payments done for voting
                are non-refundable.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
