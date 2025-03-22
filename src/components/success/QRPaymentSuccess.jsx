import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const QRPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId, contestant } = location.state || {}; // Get state values

  const handleGoHome = () => {
    navigate("/"); // Navigate to home
    window.location.reload(); // Reload the page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customBlue text-white text-center">
      
      {/* Lottie Animation */}
      <div className="w-60 h-60 mb-4">
        <DotLottieReact src="/animations/success.lottie" loop autoplay />
      </div>

      <h1 className="text-2xl font-semibold">Vote Successful!</h1>
      <p>Your votes have been successfully added to {contestant?.name || "N/A"}</p>
      <p>
        Your Transaction ID is:{" "}
        <span className="font-bold">{transactionId || "N/A"}</span>
      </p>
      <p className="mt-2">
        If you have any issues, you can reach us at
        <span className="text-green-400"> +9779705511188 (WhatsApp)</span>.
      </p>
      <p className="mt-4 font-semibold">Best Regards</p>

      {/* Return to Home Button */}
      <button
        onClick={handleGoHome}
        className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
      >
        Return to Home
      </button>
    </div>
  );
};

export default QRPaymentSuccess;
