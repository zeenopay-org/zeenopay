import { useState } from "react";
import { motion } from "framer-motion";
import ElegantSpinner from "./ElegantSpinner";

const ConfirmCancelPopup = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-customBlue p-8 rounded-2xl shadow-2xl w-[90%] max-w-[450px] h-[280px] flex flex-col justify-center items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Loading Animation */}
        {isLoading ? (
          <ElegantSpinner />
        ) : (
          <>
            {/* Sad Emoji Based on Choice */}
            <motion.span
              className="text-5xl mb-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              😢
            </motion.span>

            {/* Message */}
            <p className="text-lg font-semibold text-white mb-4">
              Do you want to cancel the transaction?
            </p>

            {/* Buttons with Click & Hover Effects */}
            <div className="flex gap-6">
              {/* "No" Button with Click Effect */}
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow-md hover:bg-gray-400 transition flex items-center gap-2"
              >
                😌 No
              </motion.button>

              {/* "Yes" Button with Click Effect */}
              <motion.button
                onClick={handleConfirm}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
              >
                😢 Yes
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfirmCancelPopup;
