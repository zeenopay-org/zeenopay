import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId} = location.state || {}; // Get state values

  const handleGoRegistration = () => {
    navigate("/registration"); // Navigate to home
    window.location.reload(); // Reload the page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customBlue text-white text-center">
      
      {/* Lottie Animation */}
      <div className="w-60 h-60 mb-4">
        <DotLottieReact src="/animations/success.lottie" loop autoplay />
      </div>

      <h1 className="text-2xl font-semibold">Registration Successful <span className="text-yellow-500">!</span></h1>
      <p>You have registered successfully.</p>
      <p>
        Your Transaction ID is:{" "}
        <span className="font-bold text-green-400">{transactionId || "N/A"}</span>
      </p>
      <p className="mt-2">
        If you have any issues, you can reach us at
        <span className="text-green-400"> +9779705511188 (WhatsApp)</span>.
      </p>
      <p className="mt-4 font-semibold">Best Regards</p>

      {/* Return to Home Button */}
      <button
        onClick={handleGoRegistration}
        className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
      >
        Return to Registration Page
      </button>
    </div>
  );
};

export default RegistrationSuccess;
