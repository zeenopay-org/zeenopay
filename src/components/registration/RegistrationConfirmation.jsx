import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import { motion } from "framer-motion";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup.jsx";
import ElegantSpinner from "../confirmCanclePupup/ElegantSpinner.jsx";
import QRCodeStyling from "qr-code-styling";
import { FaInfoCircle, FaCreditCard } from "react-icons/fa";

import {
  FaUser,
  FaBirthdayCake,
  FaTransgender,
  FaRulerVertical,
  FaWeight,
  FaSchool,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaUserFriends,
  FaMoneyBill,
  FaRegQuestionCircle,
  FaBullhorn,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";

function RegistrationConfirmation() {
  useEffect(() => {
    setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    }, 100);
  }, []);

  const location = useLocation();
  const state = location.state;
  // Ensures state is never undefined
  const [payment, setPayment] = useState({ method: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [countdown, setCountdown] = useState(360); // 6 minutes in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [qrString, setQrString] = useState("");
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const {
    paymentParnter,
    getPaymentPartner,
    initiatePartnerPayment,
    redirectToPaymentPage,
    redirectToFoneAndPrabhuPay,
    redirectToPhonePe,
    generateDynamicQr,
    paymentIframeUrl,
    paymentStatus,
    transactionId,
    setTransactionId,
    // getForm,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentPartner();
  }, [getPaymentPartner]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (isCountdownActive && showQRModal && payment.method !== "COD") {
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
  }, [isCountdownActive, showQRModal, payment.method]);

  const handleDoneClick = () => {
    window.location.href = "/registration";
    wwindow.location.href = "/registration";
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (
      countdown === 0 &&
      isCountdownActive &&
      showQRModal &&
      payment.method !== "COD"
    ) {
      const redirect = async () => {
        // Close modal first
        await new Promise((resolve) => {
          setShowQRModal(false);
          resolve();
        });

        // Then navigate to failure page
        navigate("/failure", {
          state: {
            message: "QR Code expired",
            amount: state?.amount,
          },
        });
      };

      redirect();
    }
  }, [
    countdown,
    isCountdownActive,
    showQRModal,
    payment.method,
    navigate,
    state?.amount,
  ]);

  // Reset countdown when modal closes or payment method changes
  useEffect(() => {
    if (!showQRModal || payment.method === "COD") {
      setCountdown(360);
      setIsCountdownActive(false);
    }
  }, [showQRModal, payment.method]);

  // Format time function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // const storedPaymentStatus = localStorage.getItem("paymentStatus");
    if (paymentStatus === "SUCCESS") {
      navigate("/registration-success", { state: { transactionId } });
      requestAnimationFrame(() => {
        localStorage.removeItem("paymentStatus");
      });
    }
  }, [paymentStatus, navigate, transactionId]);

  const handleCOD = (action_id, amount) => {
    try {
      // Create the COD data object
      const codData = {
        action_id: action_id,
        amount: amount,
        paymentStatus: "DUE",
      };

      // Convert to JSON string
      const codDataString = JSON.stringify(codData);
      console.log("codDataString:", codDataString);

      // Set the QR string state which will trigger the QR code generation
      // setQrString({ QR: codDataString });

      // Show the QR modal
      setShowQRModal(true);

      console.log("COD QR code generated successfully");
      return codData;
    } catch (error) {
      console.error("Error generating COD QR code:", error);
      alert("Failed to generate COD QR code. Please try again.");
      throw error;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const {
      image,
      name,
      // gender,
      // permanentAddress,
      // temporaryAddress,
      // guardianName,
      contactNumber,
      // optionalNumber,
      email,
      // reason,
      // source,
      // dateOfBirth,
      // video,
      amount,
      form_id,
      action_id,
    } = state;
    if (!name || !contactNumber || !email || !form_id || !amount) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }
    let partner = payment.method;
    if (partner === "COD") {
      return handleCOD(action_id, amount);
    }
    if (partner === "Stripe") {
      partner = "stripe";
    }
    if (partner === "PhonePe") {
      partner = "phonepe";
    }
    if (partner === "PayU") {
      partner = "payu";
    }

    const intentID = form_id;
    const eventId = form_id;

    let currency;
    if (paymentParnter.cc === "in") {
      currency = "INR";
    } else if (paymentParnter.cc === "np") {
      currency = "NPR";
    }
    const intent = "F";
    const actionId = action_id;
    const paymentUrl = await initiatePartnerPayment(
      intentID,
      amount,
      name,
      email,
      contactNumber,
      partner,
      eventId,
      intent,
      currency,
      actionId
    );
    if (paymentUrl) {
      if (
        partner === "esewa" ||
        partner === "fonepay" ||
        partner === "prabhupay"
      ) {
        console.log("Redirecting to Fonepay or PrabhuPay...");
        redirectToFoneAndPrabhuPay(paymentUrl);
      } else if (partner === "phonepe") {
        redirectToPhonePe(paymentUrl);
      } else {
        redirectToPaymentPage(paymentUrl);
        console.log("Redirecting to ...");
      }
    } else {
      console.log("Payment URL is not available");
    }
  };

  const handleQR = async (e) => {
    e.preventDefault();
    const { name, contactNumber, email, form_id, amount, action_id } = state;
    if (!name || !contactNumber || !email || !form_id || !amount) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }
    const intentID = form_id;
    const eventId = form_id;
    const intent = "F";
    const actionId = action_id;
    setShowSpinner(true);

    try {
      const paymentUrl = await generateDynamicQr(
        intentID,
        amount,
        eventId,
        intent,
        actionId
      );
      if (paymentUrl) {
        setQrString(paymentUrl);
        const txid = paymentUrl.transactionID;
        setShowQRModal(true);
        setIsCountdownActive(true); // Activate countdown here
        setTransactionId(txid);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setShowSpinner(false);
    }
  };

  const handlePaymentChange = (e) => {
    setPayment({ method: e.target.value });
  };

  useEffect(() => {
    if (qrString && qrRef.current) {
      qrRef.current.innerHTML = "";

      // Create a new QRCodeStyling instance
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

      // Append QR code to the ref
      qrCode.append(qrRef.current);
    }
  }, [qrString]);

  // Define payment partners based on country code
  const getPaymentPartners = () => {
    if (paymentParnter?.cc === "np") {
      return {
        fonepay: "Mobile/Internet Banking",
        esewa: "eSewa",
        khalti: "khalti",
        qr: "Through QR",
        COD: (
          <>
            Pay Later <br />
            (Payment can be done at the auditions venue)
          </>
        ),
      };
    }
    return paymentParnter?.partner || [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const DOB = formatDate(state?.dateOfBirth);
  const paymentPartners = getPaymentPartners();
  const iconStyle = { color: "#FFAA33", marginRight: "8px" };

  return (
    <div className=" w-full bg-customBlue ">
      <div className="flex justify-center items-center pt-11 pb-6 px-2">
        <div className="flex justify-center items-center ">
          <div className="flex justify-center items-center p-2 pt-2 pb-2">
            <div className="bg-customDarkBlue  flex flex-col md:flex-row text-gray-400 p-6 md:p-10 rounded-lg gap-4">
              {/* Image section - will appear first on mobile, and on right on desktop */}
              {state?.image && (
                <div className="flex justify-center order-first md:order-last md:w-[300px]">
                  <img
                    src={state.image}
                    alt="User"
                    className="w-52 h-52 md:w-[260px] md:h-[260px] object-cover rounded-xl border-2 border-[#FFAA33]"
                  />
                </div>
              )}

              {/* Text Fields section - will appear second on mobile, and on left on desktop */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex justify-center  md:justify-center">
                  <FaInfoCircle className="text-[#FFAA33]  mt-2 mr-2" />
                  <h1 className="text-2xl font-semibold mb-4">
                    Filled Informations
                  </h1>
                </div>

                {state?.name && (
                  <p className="text-xs md:text-lg">
                    <FaUser className="inline mr-2 text-[#FFAA33] " />
                    <strong>Name:</strong> {state?.name}
                  </p>
                )}
                {state?.age && (
                  <p className="text-xs md:text-lg">
                    <FaBirthdayCake className="inline mr-2 text-[#FFAA33]" />
                    <strong>Age:</strong> {state?.age}
                  </p>
                )}
                {state?.amount && (
                  <p className="text-xs md:text-lg">
                    <FaMoneyBill className="inline mr-2 text-[#FFAA33]" />
                    <strong>Amount:</strong> {state?.amount}
                  </p>
                )}
                {state?.dateOfBirth && (
                  <p className="text-xs md:text-lg">
                    <FaBirthdayCake className="inline mr-2 text-[#FFAA33]" />
                    <strong>Date of Birth:</strong> {DOB}
                  </p>
                )}
                {state?.gender && (
                  <p className="text-xs md:text-lg">
                    <FaTransgender className="inline mr-2 text-[#FFAA33]" />
                    <strong>Gender:</strong> {state?.gender}
                  </p>
                )}
                {state?.height && (
                  <p className="text-xs md:text-lg">
                    <FaRulerVertical className="inline mr-2 text-[#FFAA33]" />
                    <strong>Height:</strong> {state?.height}
                  </p>
                )}
                {state?.weight && (
                  <p className="text-xs md:text-lg">
                    <FaWeight className="inline mr-2 text-[#FFAA33]" />
                    <strong>Weight:</strong> {state?.weight}
                  </p>
                )}
                {state?.schoolName && (
                  <p className="text-xs md:text-lg">
                    <FaSchool className="inline mr-2 text-[#FFAA33]" />
                    <strong>School Name:</strong> {state?.schoolName}
                  </p>
                )}
                {state?.permanentAddress && (
                  <p className="text-xs md:text-lg">
                    <FaHome className="inline mr-2 text-[#FFAA33]" />
                    <strong>Permanent Address:</strong>{" "}
                    {state?.permanentAddress}
                  </p>
                )}
                {state?.temporaryAddress && (
                  <p className="text-xs md:text-lg">
                    <FaHome className="inline mr-2 text-[#FFAA33]" />
                    <strong>Temporary Address:</strong>{" "}
                    {state?.temporaryAddress}
                  </p>
                )}
                {state?.guardianName && (
                  <p className="text-xs md:text-lg">
                    <FaUserFriends className="inline mr-2 text-[#FFAA33]" />
                    <strong>Guardian's Name:</strong> {state?.guardianName}
                  </p>
                )}
                {state?.contactNumber && (
                  <p className="text-xs md:text-lg">
                    <FaPhone className="inline mr-2 text-[#FFAA33]" />
                    <strong>Contact Number:</strong> {state?.contactNumber}
                  </p>
                )}
                {state?.optionalNumber && (
                  <p className="text-xs md:text-lg">
                    <FaPhone className="inline mr-2 text-[#FFAA33]" />
                    <strong>Optional Contact Number:</strong>{" "}
                    {state?.optionalNumber}
                  </p>
                )}
                {state?.email && (
                  <p className="text-xs md:text-lg">
                    <FaEnvelope className="inline mr-2 text-[#FFAA33]" />
                    <strong>Email:</strong> {state?.email}
                  </p>
                )}
                {state?.reason && (
                  <p className="text-xs md:text-lg">
                    <FaRegQuestionCircle className="inline mr-2 text-[#FFAA33]" />
                    <strong>Why do you want to participate?</strong>{" "}
                    {state?.reason}
                  </p>
                )}
                {state?.source && (
                  <p className="text-xs md:text-lg">
                    <FaBullhorn className="inline mr-2 text-[#FFAA33]" />
                    <strong>How did you hear about this event?</strong>{" "}
                    {state?.source}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3 text-gray-400 p-5">
          <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FaCreditCard className="text-green-500" /> {/* Credit card icon */}
            Payment Options:
          </h1>{" "}
          {/* Payment Options */}
          <div className="flex flex-col gap-3">
            {paymentParnter?.cc === "np" ? (
              Object.entries(paymentPartners).map(([key, value], index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                    payment.method === key
                      ? "bg-blue-800 text-white text-sm md:text-lg shadow-lg"
                      : "bg-transparent  text-xs md:text-lg hover:bg-blue-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={key}
                    checked={payment.method === key}
                    onChange={handlePaymentChange}
                    className="hidden"
                  />
                  <div
                    className={`w-[17px] h-[17px] flex items-center justify-center border-2 rounded-full transition-all ${
                      payment.method === key
                        ? "border-gray-400 border-4 hover:bg-blue-900"
                        : "border-gray-400"
                    }`}
                  >
                    {payment.method === key && (
                      <div className="w-[10px] h-[10px]  bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  {value}
                </label>
              ))
            ) : paymentParnter?.partner?.length > 0 ? (
              paymentParnter.partner.map((option, index) =>
                option === "Stripe" ? (
                  <p key={index} className="text-red-500">
                    Registration is not available in your country.
                  </p>
                ) : (
                  <label
                    key={index}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      payment.method === option
                        ? "bg-blue-800 text-white shadow-lg"
                        : "bg-transparent hover:bg-blue-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option}
                      checked={payment.method === option}
                      onChange={handlePaymentChange}
                      className="hidden"
                    />
                    <div
                      className={`w-[17px] h-[17px] flex items-center justify-center border-2 rounded-full transition-all ${
                        payment.method === option
                          ? "border-gray-400 border-4 hover:bg-blue-900"
                          : "border-gray-400"
                      }`}
                    >
                      {payment.method === option && (
                        <div className="w-[10px] h-[10px] bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    {option}
                  </label>
                )
              )
            ) : (
              <p className="text-red-500">No payment partners available.</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pb-11 px-6">
        <button
          onClick={payment.method === "qr" ? handleQR : handlePayment}
          className="bg-customSky w-[900px] flex justify-center items-center gap-3  text-white py-[12px] rounded-[24px]"
        >
          Continue
        </button>
      </div>
      {paymentIframeUrl && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[80%] md:w-[60%] lg:w-[40%] h-[70%] bg-customBlue rounded-2xl overflow-hidden relative flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header with Close Button */}
            <div className="bg-customBlue p-4 flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Payment</h2>
              <button
                onClick={() => setShowConfirm(true)}
                className="text-white text-xl hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            <iframe
              src={paymentIframeUrl}
              className="w-full flex-grow"
              allow="fullscreen"
              allowFullScreen
              style={{
                WebkitOverflowScrolling: "touch",
                overflowY: "auto",
                touchAction: "manipulation",
              }}
            ></iframe>
          </motion.div>

          {/* Confirmation Popup */}
          {showConfirm && (
            <ConfirmCancelPopup
              onClose={() => setShowConfirm(false)}
              onConfirm={() => window.location.reload()}
            />
          )}
        </motion.div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-customBlue p-3 rounded-lg md:mt-20 text-center w-[26rem] border border-gray-700 relative">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center bg-customBlue p-3 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">
                {payment.method === "COD"
                  ? "Payment Due - Pay Later"
                  : "Scan & Pay via Banking Apps, Esewa, Khalti, and all major wallets"}
              </h2>
              <button
                onClick={() => setShowConfirm(true)}
                className="text-white text-xl pl-4 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
            <div className="bg-customDarkBlue p-4 rounded-lg">
              <div className="bg-customDarkBlue pl-3 rounded-lg">
                <div ref={qrRef}></div>
                {payment.method !== "COD" && (
                  <>
                    <div className=" flex justify-center mt-2 text-center">
                      <p className="text-sm text-white">
                        {countdown > 0 ? "QR expires in:" : "QR has expired!"}
                      </p>
                      {countdown > 0 ? (
                        <p
                          className={`text-lg ml-1 -mt-1 font-bold ${
                            countdown <= 60 ? "text-red-500" : "text-green-500"
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
                    <p className="text-[10px] text-red-500">
                      Note: Please do not close this screen untill the
                      registration is success.
                    </p>
                  </>
                )}

                {payment.method === "COD" && (
                  <div className="text-center mt-2">
                    <p className="text-white">
                      <span className="text-red-500"> NOTE:</span> YOUR FORM HAS
                      BEEN SUBMITTED. You Can Pay The Registration Fee at The
                      Auditions Venue.
                    </p>
                    <button
                      onClick={handleDoneClick}
                  className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                    >
                      Done
                    </button>
                  </div>
                )}

                {payment.method !== "COD" && (
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
                )}
              </div>
            </div>
            {/* Total Amount Section */}
            <div className="flex mt-2 text-white pt-4">
              <p className="ml-6 text-sm md:text-md">TOTAL AMOUNT NPR.</p>
              <div className="flex justify-end w-44">
                <span className="ml-10 bg-[#00255c] opacity-80 h-8 w-20 rounded-lg text-green-600 text-xl font-bold flex items-center justify-center">
                  {state.amount}
                </span>
              </div>
            </div>
            <p className="text-xs mt-4">
              <span className="text-red-500"> NOTE:</span> I hereby accept the
              Terms of Services and acknowledge that payments done for
              registration are non-refundable.
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
        </div>
      )}
      {showSpinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <ElegantSpinner />
        </div>
      )}
    </div>
  );
}

export default RegistrationConfirmation;
