import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import { motion } from "framer-motion";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup.jsx";
import ElegantSpinner from "../confirmCanclePupup/ElegantSpinner.jsx";
import { Currency } from "lucide-react";

function RegistrationConfirmation() {
  const location = useLocation();
  const state = location.state;
  // Ensures `state` is never undefined

  const [payment, setPayment] = useState({ method: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  console.log("states: ", state);

  const {
    paymentParnter,
    getPaymentPartner,
    initiatePartnerPayment,
    redirectToPaymentPage,
    redirectToFoneAndPrabhuPay,
    redirectToPhonePe,
    generateDynamicQr,
    paymentIframeUrl,
    generateIntentId,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentPartner();
  }, [getPaymentPartner]);

  // Handle form submission to initiate payment
  const handlePayment = async (e) => {
    e.preventDefault();
    const {
      image,
      name,
      gender,
      permanentAddress,
      temporaryAddress,
      guardianName,
      contactNumber,
      optionalNumber,
      email,
      reason,
      source,
      dateOfBirth,
      video,
      amount,
      form_id,
    } = state;

    if (!name || !contactNumber || !email || !form_id || !amount) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }

    let partner = payment.method;

    // Convert "stripe_gbl" to "stripe"
    if (partner === "stripe_uk") {
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
    console.log(eventId, ": event id");
    console.log(intentID, ": intend Id");

    const intent = "F";

    const paymentUrl = await initiatePartnerPayment(
      intentID,
      amount,
      name,
      email,
      contactNumber,
      partner,
      eventId,
      intent,
    );

    console.log("event Id bhbshdb sjksjvunisk:", payment);

    if (paymentUrl) {
      console.log("selected Partner ", partner);

      if (partner === "fonepay" || partner === "prabhupay") {
        console.log("Redirecting to Fonepay or PrabhuPay...");
        redirectToFoneAndPrabhuPay(paymentUrl);
      }else if(partner === "phonepe"){
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
    const { name, contactNumber, email, form_id, amount } = state;

    if (!name || !contactNumber || !email || !form_id || !amount) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }

    const intentID = form_id;
    const partner = payment.method;
    const eventId = form_id;
    const intent = "form";

    console.log("eventId:", eventId);
    console.log("intentID:", intentID);

    setShowSpinner(true); // Show spinner while generating QR

    try {
      // Generate the QR Code URL
      const paymentUrl = await generateDynamicQr(intentID, amount, intent);
      console.log("Generated Dynamic QR Payment URL:", paymentUrl);

      // Update the QR code URL state
      setQrCodeUrl(paymentUrl);

      // Show the QR code modal
      setShowQRModal(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setShowSpinner(false); // Hide the spinner
    }
  };

  const handlePaymentChange = (e) => {
    setPayment({ method: e.target.value });
  };

  return (
    <div className=" w-full bg-customBlue ">
      <div className="flex justify-center items-center  pt-11 pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3  text-gray-400 p-12 ">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Filled Informations</h1>
          </div>

          {/* for name */}
          {state?.name && (
            <p>
              <strong>Name: </strong> {state?.name || "N/A"}
            </p>
          )}

          {/* age */}
          {state?.age && (
            <p>
              <strong>Age: </strong> {state?.age || "N/A"}
            </p>
          )}

          {/* amount */}
          {state?.amount && (
            <p>
              <strong>Amount: </strong> {state?.amount || "N/A"}
            </p>
          )}

          {state?.dateOfBirth && (
            <p>
              <strong>Date of Birth: </strong> {state?.dateOfBirth || "N/A"}
            </p>
          )}

          {/* for gender */}
          {state?.gender && (
            <p>
              <strong>Gender: </strong> {state?.gender || "N/A"}
            </p>
          )}

          {/* for height */}
          {state?.height && (
            <p>
              <strong>Height: </strong> {state?.height || "N/A"}
            </p>
          )}

          {/* for weight */}
          {state?.height && (
            <p>
              <strong>Weight: </strong> {state?.weight || "N/A"}
            </p>
          )}

          {state?.permanentAddress && (
            <p>
              <strong>Permanent Address:</strong>{" "}
              {state?.permanentAddress || "N/A"}
            </p>
          )}

          {state?.temporaryAddress && (
            <p>
              <strong>Temporary Address:</strong>{" "}
              {state?.temporaryAddress || "N/A"}
            </p>
          )}

          {state?.guardianName && (
            <p>
              <strong>Guardian's Name:</strong> {state?.guardianName || "N/A"}
            </p>
          )}

          {state?.contactNumber && (
            <p>
              <strong>Contact Number:</strong> {state?.contactNumber || "N/A"}
            </p>
          )}

          {state?.optionalNumber && (
            <p>
              <strong>Optional Contact Number:</strong>{" "}
              {state?.optionalNumber || "N/A"}
            </p>
          )}

          {state?.email && (
            <p>
              <strong>Email:</strong> {state?.email || "N/A"}
            </p>
          )}

          {state?.reason && (
            <p>
              <strong>Why do you want to participate?</strong>{" "}
              {state?.reason || "N/A"}
            </p>
          )}

          {state?.source && (
            <p>
              <strong>How did you hear about this event?</strong>{" "}
              {state?.source || "N/A"}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3 text-gray-400 p-12">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Payment Options:</h1>
          </div>
          {/* Payment Options */}
          <div className="flex flex-col gap-3">
            {paymentParnter?.partner?.map((option, index) => (
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
            ))}
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

            {/* Iframe */}
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
          <div className="bg-customBlue p-6 rounded-lg -mt-12 md:mt-5 text-center w-[26rem] border border-gray-700 relative">
            {/* Header with Close Button */}
            <div className="bg-customDarkBlue p-4 rounded-lg">
              <div className="bg-customDarkBlue p-4 rounded-lg">
                <div className="flex justify-between items-center bg-customBlue p-3 rounded-t-lg">
                  <h2 className="text-sm font-semibold text-white">
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
