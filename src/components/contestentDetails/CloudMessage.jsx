import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CloudMessage() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show the GIF initially
    setIsVisible(true);
    
    // Set up the animation cycle
    const interval = setInterval(() => {
      // Show the GIF
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 5000); 
      
    }, 6000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 0.6 }}
      transition={{ duration: 0.8 }} 
      className="ml-20 -mt-20 z-20"
    >
      {/* Cloud Image */}
      <div className="z-20">
        <img
          src="/assets/story_gif.GIF"
          alt="Cloud"
          className="w-[200px] h-[100px]"
        />
      </div>
    </motion.div>
  );
}