import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import countryCodes from "./countryCodes";
import PhoneInputWithCountrySelector from "../ReusableInputField/PhoneInputWithCountrySelector";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup";

export default function QrCode({ handleX }) {
  const { id } = useParams();
  const inputRef = useRef(null);

  const {
    event,
    getContestant,
    contestant,
    getPaymentCurrency,
    generateDynamicQr,
    generateIntentId,
    qrLoading,
    paymentStatus,
    setTransactionId,
    transactionId,
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
  const [inputFocused, setInputFocused] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drop, setDrop] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const handleButtonClick = () => {
    inputRef.current.focus();
  };

  const navigate = useNavigate();

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      setSelectedCountry(JSON.parse(savedCurrency));
    } else {
      getPaymentCurrency();
    }
  }, []);

  useEffect(() => {
    const { name } = formData;
    const storedPaymentStatus = localStorage.getItem("paymentStatus");

    if (paymentStatus === "SUCCESS" || storedPaymentStatus === "SUCCESS") {
      navigate("/success", { state: { transactionId, contestant, name } });

      // Remove paymentStatus right after navigation is triggered
      requestAnimationFrame(() => {
        localStorage.removeItem("paymentStatus");
      });
    }
  }, [paymentStatus]);

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

  const handleChange = (e) => {
    const value = e.target.value;
    setHasValue(value.trim() !== "");
    setFormData((prevData) => ({
      ...prevData,
      votes: value,
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
  const scrolltotop = (e) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      handleQR(e);
    }, 500);
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

      // 1️⃣ Generate the QR Code URL
      const paymentUrl = await generateDynamicQr(
        intentID,
        calculatedAmount,
        name,
        email,
        phone
      );

      if (paymentUrl) {
        setQrCodeUrl(paymentUrl);
        setShowQRModal(true);
        const txid = paymentUrl.split("/")[4].split("_")[1].split(".")[0];
        console.log("Extracted txid:", txid);
        setTransactionId(txid); 
      } else {
        console.log("QR Code URL is not available.");
      }
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
          <img className="h-8 w-14" src="/assets/vote-icon.png" alt="" />
          {option}
        </button>
      )),
    [voteOptions]
  );

  return (
    <div className="absolute top-[450px] md:top-1/2 lg:top-[350px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-none z-20 flex items-center justify-center text-white rounded-2xl overflow-hidden p-6">
      <div className="relative flex items-center justify-center mt-28">
        <div className="p-4 bg-customDarkBlue shadow-lg shadow-cyan-500/50 text-white rounded-2xl overflow-y-auto max-h-[90vh] ios-srollbar">
          <div className="relative">
            <button
              onClick={handleX}
              className="absolute top-0 right-0 flex items-center justify-center text-white text-xl pl-2 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>

          <div className=" mt-4 md:mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-center">
              {event.title}
            </h1>
            <div className="mt-6 text-center">
              <h2 className="text-lg font-normal">Select Voting Options</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 mt-4">
                {voteButtons}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleButtonClick}
                className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-600  rounded-2xl"
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
                  className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl transition"
                >
                  -
                </button>

                {/* Input Wrapper */}
                <div className="relative flex-grow">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    ref={inputRef}
                    className={`peer w-full h-12 bg-transparent text-white text-lg outline-none border border-gray-600 hover:border-blue-500 rounded-lg px-4 pt-5 pb-1 text-center
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
          ? "top-0 -translate-y-1/2 scale-90 text-blue-500 bg-customDarkBlue px-2"
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
                  className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl transition"
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
                <div className="relative w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="peer p-3 bg-transparent border border-gray-600 hover:border-blue-500 rounded-lg text-white w-full outline-none placeholder-transparent focus:border-blue-500 transition-all duration-300"
                    placeholder="Name (Voter)"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                  {/* Floating Label */}
                  <label
                    htmlFor="name"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base pointer-events-none transform transition-all duration-300 ease-in-out
        ${
          formData.name || inputFocused
            ? "top-0 -translate-y-1/2 scale-90 text-blue-500 px-2"
            : "top-1/2 -translate-y-1/2 scale-100"
        }`}
                  >
                    Name (Voter)
                  </label>
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  )}
                </div>

                <PhoneInputWithCountrySelector
                  countryCodes={countryCodes}
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  placeholder="Phone"
                  fieldName="phone"
                />
              </div>
            </div>

            <div className="flex item-center justify-center pb-16 ">
              <button
                className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl w-28 flex justify-center items-center"
                onClick={scrolltotop}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-customBlue p-6 rounded-lg mt-20 text-center w-[26rem] border border-gray-700 relative">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center bg-customBlue p-3 rounded-t-lg">
                <h2 className="text-lg font-semibold text-white">
                  Scan & Pay via Banking Apps, Esewa, Khalti and all major
                  wallets
                </h2>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="text-white text-xl pl-2 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>

              {/* QR Code Container */}
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
                    src="/assets/IMG_1574.png"
                    className="w-24 h-10"
                    alt="FonePay Logo"
                  />
                </div>
              </div>

              {/* Total Amount Section */}
              <div className="flex mt-2 text-white pt-4">
                <p className="ml-6 text-md">TOTAL AMOUNT NPR.</p>
                <div className="flex justify-end w-44">
                  <span className="ml-10 bg-[#00255c] opacity-80 h-8 w-20 rounded-lg text-green-600 text-xl font-bold flex items-center justify-center">
                    {calculatedAmount}
                  </span>
                </div>
              </div>

              {/* Note Section */}
              <p className="text-xs mt-4">
                <span className="text-red-500"> NOTE:</span> I hereby accept the
                Terms of Services and acknowledge that payments done for voting
                are non-refundable.
              </p>
            </div>

            {/* Confirm Cancel Popup */}
            {showConfirm && (
              <ConfirmCancelPopup
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                  setShowQRModal(false);
                  setShowConfirm(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
