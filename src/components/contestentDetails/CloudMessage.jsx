import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CloudMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size on mount and resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Toggle visibility every 5 seconds
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.8 }}
      className="absolute z-20 right-0"
      style={{
        top: '-10%',
        marginRight: isMobile ? '-60px' : '-120px',
        transform: 'translateY(-50%)'
      }}
    >
      <div className="z-20 relative">
        <img
          src="https://media.zeenopay.com/story_info_new.PNG"
          alt="Cloud"
          className="w-[180px] h-[90px] md:w-[250px] md:h-[120px]"
          style={{
            filter: 'drop-shadow(5px 5px 5px rgba(0,0,0,0.3))'
          }}
        />
      </div>
    </motion.div>
  );
}
