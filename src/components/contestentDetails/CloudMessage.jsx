import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CloudMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size on mount and resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Initial delay before first appearance (3 seconds)
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
      
      // Start the cycle after initial appearance
      startCycle();
    }, 3000);

    const startCycle = () => {
      // Show for 1 minute (60000ms), then hide for 30 seconds (30000ms)
      const cycleInterval = setInterval(() => {
        setIsVisible(true);
        
        const hideTimeout = setTimeout(() => {
          setIsVisible(false);
        }, 60000);
        
        return () => clearTimeout(hideTimeout);
      }, 90000); 

      return () => clearInterval(cycleInterval);
    };

    return () => {
      clearTimeout(initialDelay);
    };
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
      {/* Cloud Image with responsive sizing */}
      <div className="z-20 relative">
        <img
          src="/assets/story_gif.GIF"
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