import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CloudMessage() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Fade out after 2 seconds
    }, 10000); // Show every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 0.6 }}
      transition={{ duration: 0.6 }}
      className="ml-20 -mt-20  z-20"
    >
      {/* Cloud Image */}
      <div className=" z-20">
        <img
          src="/assets/cloud.png"
          alt="Cloud"
          className="w-[200px] h-[100px]"
        />
      </div>
    </motion.div>
  );
}
