import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import countryCodes from "./countryCodes";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup";
import { motion } from "framer-motion";
import ElegantSpinner from "../confirmCanclePupup/ElegantSpinner.jsx";
import QRCodeStyling from "qr-code-styling";

export default function QrCode({ handleX, qrid }) {
  const { id: paramId } = useParams();
  const id = qrid ? qrid : paramId;
  const inputRef = useRef(null);
  const qrRef = useRef(null);
  const [countdown, setCountdown] = useState(360);
  const navigate = useNavigate();

  const {
    event,
    getContestant,
    contestant,
    getPaymentCurrency,
    generateDynamicQr,
    generateStaticQr,
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
    amount: "",
    qrType: "",
  });

  const [hasValue, setHasValue] = useState(!!formData.votes);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [qrString, setQrString] = useState("");
  const [showVoteSelection, setShowVoteSelection] = useState(false);
  
  const handleButtonClick = () => {
    inputRef.current.focus();
  };

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
    let timer;
    if (showQRModal && formData.qrType === "One Time Use QR") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showQRModal, formData.qrType]);

  useEffect(() => {
    if (
      countdown === 0 &&
      showQRModal &&
      formData.qrType === "One Time Use QR"
    ) {
      const redirect = async () => {
        await new Promise((resolve) => {
          setShowQRModal(false);
          resolve();
        });
        navigate("/failure", {
          state: {
            message: "QR Code expired",
            contestant,
            amount: calculatedAmount,
          },
        });
      };
      redirect();
    }
  }, [countdown, showQRModal, formData.qrType, navigate]);

  useEffect(() => {
    if (!showQRModal) {
      setCountdown(360);
    }
  }, [showQRModal]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      setSelectedCountry(JSON.parse(savedCurrency));
    } else {
      getPaymentCurrency();
    }
  }, []);

  const handleQrTypeChange = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      qrType: option,
      votes: option === "Multiple Time Use QR" ? "0" : prevData.votes
    }));
    setShowVoteSelection(option === "One Time Use QR");
  };

  useEffect(() => {
    const storedPaymentStatus = localStorage.getItem("paymentStatus");
    if (paymentStatus === "SUCCESS" || storedPaymentStatus === "SUCCESS") {
      navigate("/success", { state: { transactionId, contestant } });
      requestAnimationFrame(() => {
        localStorage.removeItem("paymentStatus");
      });
    }
  }, [paymentStatus, navigate, transactionId, contestant]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.qrType) newErrors.qrType = "Please select a QR type.";
    if (formData.qrType === "One Time Use QR" && (!formData.votes || formData.votes < 10)) {
      newErrors.votes = "Minimum 10 votes required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    const updatedVotes = Math.max(10, Math.min(15000, value));
    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
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
      const { votes, qrType } = formData;
      const eventID = contestant.event;

      setShowSpinner(true);

      const intentID = qrid;
      let paymentUrl;

      if (qrType === "One Time Use QR") {
        paymentUrl = await generateDynamicQr(
          intentID,
          calculatedAmount,
          eventID
        );
        if (paymentUrl) {
          setQrString(paymentUrl);
          const txid = paymentUrl.transactionID;
          setShowQRModal(true);
          setTransactionId(txid);
        } else {
          console.log("QR Code URL is not available.");
        }
      } else if (qrType === "Multiple Time Use QR") {
        paymentUrl = await generateStaticQr(
          intentID,
          0, // Amount is 0 for multiple use QR
          eventID
        );
        if (paymentUrl) {
          setQrString(paymentUrl);
          setShowQRModal(true);
        } else {
          console.log("Failed to generate Static QR.");
        }
      }
      setShowSpinner(false);
    }
  };

  const calculatedAmount = useMemo(
    () => (formData.votes || 0) * votePrice,
    [formData.votes]
  );

  useEffect(() => {
    if (qrString && qrRef.current) {
      qrRef.current.innerHTML = "";

      const qrCode = new QRCodeStyling({
        width: 332,
        height: 332,
        type: "svg",
        data: qrString.QR,
        image: "https://zeenorides.com/zeenopay_logo.svg",
        dotsOptions: {
          color: "#39b6ff",
          type: "extra-rounded",
        },
        backgroundOptions: {
          color: "#000",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.5,
          margin: 0,
          hideBackgroundDots: false,
        },
      });

      qrCode.append(qrRef.current);
    }
  }, [qrString]);

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

  const options = [
    {
      label: "One Time Use QR",
      description: "Supports eSewa, Banking Apps & all other major wallets",
    },
    {
      label: "Multiple Time Use QR",
      description: "Supports Banking Apps only but can be used multiple times",
    },
  ];

  return (
    <div className="absolute top-[450px] md:w-auto w-[96%] md:top-1/2 lg:top-[400px] mt-28 bg-customDarkBlue shadow-lg shadow-cyan-500/50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-none z-20 flex items-center justify-center text-white rounded-2xl overflow-hidden p-6">
      <div className="relative flex items-center justify-center">
        <div className="p-4 bg-customDarkBlue text-white rounded-2xl overflow-y-auto max-h-[105vh]">
          <div className="relative">
            <button
              onClick={handleX}
              className="absolute top-0 right-0 flex items-center justify-center text-white text-xl pl-2 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 md:mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-center">
              {event.title}
            </h1>
            
            {/* QR Type Selection */}
            <div className="space-y-4 bg-customDarkBlue p-4 rounded-lg mt-6">
              <h2 className="text-lg font-normal text-center mb-4">Select QR Type</h2>
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full flex flex-col items-start p-4 rounded-lg transition-all border ${
                    formData.qrType === option.label 
                      ? "border-blue-500 bg-blue-900 bg-opacity-20" 
                      : "border-gray-700 hover:border-blue-400"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQrTypeChange(option.label)}
                >
                  <div className="flex items-center space-x-3">
                    <motion.span
                      className={`w-4 h-4 border-2 flex items-center justify-center rounded-full ${
                        formData.qrType === option.label 
                          ? "border-blue-500" 
                          : "border-gray-500"
                      }`}
                    >
                      {formData.qrType === option.label && (
                        <motion.span
                          className="w-3 h-3 bg-blue-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.span>
                    <span
                      className={`text-sm md:text-md font-semibold ${
                        formData.qrType === option.label
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 ml-7">
                    {option.description}
                  </p>
                </motion.button>
              ))}
              {errors?.qrType && (
                <p className="text-red-400 text-sm mt-2">{errors.qrType}</p>
              )}
            </div>

            {/* Vote Selection (only shown for One Time Use QR) */}
            {showVoteSelection && (
              <>
                <div className="mt-6 text-center">
                  <h2 className="text-lg font-normal">Select Voting Options</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 mt-4">
                    {voteButtons}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleButtonClick}
                    className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl"
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-gray-400 text-xs md:text-sm text-center">
                  Min 10 votes & Max 15000 votes. One vote = Rs 10.0
                </p>

                <div className="flex flex-col items-center mt-6">
                  <div className="relative flex items-center w-full gap-2">
                    <button
                      onClick={() => {
                        handleVoteChange(formData.votes - 1);
                        setHasValue(formData.votes - 1 > 0);
                      }}
                      className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl transition"
                    >
                      -
                    </button>

                    <div className="relative flex-grow">
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        ref={inputRef}
                        className={`peer w-full h-12 bg-transparent text-white text-lg outline-none border ${
                          errors.votes ? "border-red-500" : "border-gray-600 hover:border-blue-500"
                        } rounded-lg px-4 pt-5 pb-1 text-center
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
                  {errors.votes && (
                    <p className="text-red-400 text-sm mt-2">{errors.votes}</p>
                  )}

                  {formData.qrType === "One Time Use QR" && (
                    <p className="mt-4 text-normal text-gray-400">
                      Total amount:{" "}
                      <span className="text-blue-400 font-semibold">
                        Rs {calculatedAmount}
                      </span>
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex item-center justify-center pb-16 mt-6">
              <button
                className={`mt-6 text-sm px-6 py-3 rounded-2xl w-28 flex justify-center items-center ${
                  formData.qrType 
                    ? "bg-white hover:bg-gray-300 text-purple-800"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
                onClick={scrolltotop}
                disabled={!formData.qrType || qrLoading || showSpinner || 
                  (formData.qrType === "One Time Use QR" && (!formData.votes || formData.votes < 10))}
              >
                {qrLoading || showSpinner ? (
                  <motion.div
                    className="w-6 h-6 border-4 border-customDarkBlue border-t-transparent rounded-full animate-spin"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  "Get QR"
                )}
              </button>
            </div>
          </div>
        </div>

        {showSpinner && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <ElegantSpinner />
          </div>
        )}

        {showQRModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-customBlue p-6 rounded-lg -mt-12 md:mt-5 text-center w-[26rem] border border-gray-700 relative">
              {formData.qrType === "Multiple Time Use QR" ? (
                <>
                  <div className="flex justify-between items-center bg-customBlue p-2 rounded-t-lg">
                    <h2 className="text-xs text-white">
                      <span className="font-semibold">
                        Multiple Votes are accepted!
                        <br />
                      </span>
                      You can use this QR code to vote multiple times until
                      voting ends. Screenshot and share with your audiences!{" "}
                      <br />
                      <span className="text-[9px]">
                        (Mobile Banking Apps only)
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="text-white text-xl pl-4 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-customDarkBlue p-4 rounded-lg">
                    <div className="bg-customDarkBlue p-4 rounded-lg flex flex-col items-center">
                      <div ref={qrRef}></div>
                      <div className="flex items-center justify-center mt-2 space-x-2">
                        <p className="text-red-500 ml-4 font-semibold">
                          Powered by
                        </p>
                        <img
                          src="/assets/nepalpay.png"
                          className="w-24 h-10"
                          alt="FonePay Logo"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-customBlue p-2 rounded-t-lg">
                    <h2 className="text-xs font-semibold text-white">
                      Scan & Pay via Banking Apps, Esewa, Khalti, and all major
                      wallets
                    </h2>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="text-white text-xl pl-4 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-customDarkBlue p-4 rounded-lg">
                    <div className="bg-customDarkBlue p-4 rounded-lg flex flex-col items-center">
                      <div ref={qrRef}></div>
                      {formData.qrType === "One Time Use QR" && (
                        <div className="flex mt-2 text-center">
                          <p className="text-sm text-white">
                            {countdown > 0
                              ? "QR expires in:"
                              : "QR has expired!"}
                          </p>
                          {countdown > 0 ? (
                            <p
                              className={`text-lg -mt-1 ml-1 font-bold ${
                                countdown <= 60
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {formatTime(countdown)}
                            </p>
                          ) : (
                            <p className="text-lg font-bold text-red-500">
                              Redirecting...
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-[10px] text-red-500">Note: Please do not close this screen until the vote is success.</p>
                      <div className="flex items-center justify-center mt-2 space-x-2">
                        <p className="text-red-500 ml-4 font-semibold">
                          Powered by
                        </p>
                        <img
                          src="/assets/IMG_1574.png"
                          className="w-24 h-10"
                          alt="FonePay Logo"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Total Amount Section */}
              {formData.qrType === "One Time Use QR" && (
                <div className="flex mt-2 text-white pt-4">
                  <p className="ml-6 text-sm md:text-md">TOTAL AMOUNT NPR.</p>
                  <div className="flex justify-end w-44">
                    <span className="ml-10 bg-[#00255c] opacity-80 h-8 w-20 rounded-lg text-green-600 text-xl font-bold flex items-center justify-center">
                      {calculatedAmount}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs mt-4">
                <span className="text-red-500"> NOTE:</span> I hereby accept the
                Terms of Services and acknowledge that payments done for voting
                are non-refundable.
              </p>
            </div>

            {showConfirm && (
              <ConfirmCancelPopup
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                  setShowQRModal(false);
                  setShowConfirm(false);
                }}
              />
            )}

            {paymentStatus === "SCANNED" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}