import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function FailurePage() {
      const location = useLocation();
      const navigate = useNavigate();

    const handleGoRegistration = () => {
        console.log("jfjnnsn");
        
        navigate("/registration"); // Navigate to home
        window.location.reload(); // Reload the page
      };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customBlue text-red-700">
      <div className="bg-customDarkBlue p-8 rounded-2xl shadow-lg text-center">
        <motion.div 
          className="text-6xl mb-4"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1.2, rotate: 360 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          ❌
        </motion.div>
        <h1 className="text-2xl font-bold">Payment Failed</h1>
        <p className="mt-2 text-gray-600">Your payment could not be processed. Please try again or use a different payment method.</p>
        <button 
        onClick={handleGoRegistration}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Return to Registration
        </button>
      </div>
    </div>
  );
}