import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { EventContext } from "../../EventProvider";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup";

function PaymentOption({ formData }) {
  const [payment, setPayment] = useState({ method: "stripe" }); 
  const [loading, setLoading] = useState(false);
  const { getPaymentPartner, paymentParnter } = useContext(EventContext);
    const [showConfirm, setShowConfirm] = useState(false);

  const state = formData;
  const {
    initiatePartnerPayment,
    redirectToPaymentPage,
    paymentIframeUrl,
    generateIntentId,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentPartner();
  }, []);

  useEffect(() => {
    document.body.style.overflow = paymentIframeUrl ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paymentIframeUrl]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (payment.method === "Stripe") {
      setPayment({ method: "stripe" });
    }
    const { name, phone, email, amount, currency } = state;
    const isNepal = paymentParnter?.cc === "np";
    const isIndia = paymentParnter?.cc === "in";

    if (!name || !phone || !amount || (!(isNepal || isIndia) && !email)) {
      alert("Name, Phone, and Amount are required. Email is required.");
      return;
    }

    try {
      setLoading(true);
      const intentID = generateIntentId();
      const paymentUrl = await initiatePartnerPayment(
        intentID,
        amount,
        name,
        isNepal || isIndia ? "" : email,
        phone,
        payment.method,
        currency
      );

      if (paymentUrl) {
        console.log("Redirecting to payment:", paymentUrl);
        redirectToPaymentPage(paymentUrl);
      } else {
        console.log("Payment URL is not available");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    setPayment({ method: e.target.value === "Stripe" ? "stripe" : e.target.value });
  };

  return (
    <div className="w-full bg-customBlue">
      <div className="flex justify-center items-center pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3 text-gray-400 p-12">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Payment Options:</h1>
          </div>
          <div className="flex flex-col gap-3">
            {paymentParnter?.partner?.length > 0 ? (
              paymentParnter.partner.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    payment.method === (option === "Stripe" ? "stripe" : option)
                      ? "bg-blue-800 text-white shadow-lg"
                      : "bg-transparent hover:bg-blue-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option}
                    checked={payment.method === (option === "Stripe" ? "stripe" : option)}
                    onChange={handlePaymentChange}
                    className="hidden"
                  />
                  <div
                    className={`w-[17px] h-[17px] flex items-center justify-center border-2 rounded-full transition-all ${
                      payment.method === (option === "stripe_gbl" ? "stripe" : option)
                        ? "border-gray-400 border-4 hover:bg-blue-900"
                        : "border-gray-400"
                    }`}
                  >
                    {payment.method === (option === "Stripe" ? "stripe" : option) && (
                      <div className="w-[10px] h-[10px] bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  {option === "Stripe" ? "Stripe" : option}
                </label>
              ))
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all bg-blue-800 text-white shadow-lg">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={payment.method === "stripe"}
                  onChange={handlePaymentChange}
                  className="hidden"
                />
                <div
                  className={`w-[17px] h-[17px] flex items-center justify-center border-2 rounded-full transition-all border-gray-400 border-4 hover:bg-blue-900`}
                >
                  {payment.method === "stripe" && (
                    <div className="w-[10px] h-[10px] bg-gray-400 rounded-full"></div>
                  )}
                </div>
                Stripe
              </label>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pb-11 px-6">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-customSky w-[900px] flex justify-center items-center gap-3 text-white py-[12px] rounded-[24px] relative"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-customDarkBlue border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Continue"
          )}
        </button>
      </div>

      {/* Framer Motion Popup Animation */}
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
    </div>
  );
}

export default PaymentOption;
