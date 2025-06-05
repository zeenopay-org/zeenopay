import { useEffect, useState } from "react";

const CountdownTimer = ({ endTime }) => {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const calculateTimeLeft = () => {
    if (!endTime) return null;
    
    // Parse the endTime as UTC and get current UTC time
    const endTimeUTC = new Date(endTime).getTime();
    const currentTimeUTC = new Date().getTime();
    
    const difference = endTimeUTC - currentTimeUTC;
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [endTime]);

  const getLabel = (unit) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  };

  if (!isClient || timeLeft === null) {
    return null; // or return a loading spinner
  }

  return (
    <div className="countdown-container mt-8 mb-8 flex flex-col items-center text-white p-2 xs:p-3 md:p-6 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30 w-full max-w-full overflow-hidden">
      <h2 className="text-sm xs:text-lg md:text-xl font-bold mb-2 xs:mb-3 md:mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#36AFFA] to-blue-300">
        Hurry, Before It's Too Late!
      </h2>
      
      <div className="flex flex-row flex-nowrap justify-center gap-1 xs:gap-2 md:gap-4 w-full">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="countdown-item flex flex-col items-center"
          >
            <div className="countdown-value relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-bold text-sm sm:text-lg md:text-3xl flex items-center justify-center rounded-lg xs:rounded-xl border border-indigo-400 xs:border-2 shadow-lg shadow-purple-900/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5"></div>
              <span className="relative z-10">{value}</span>
            </div>
            <span className="mt-1 md:mt-2 text-xs sm:text-xs md:text-sm font-medium flex items-center">
              <span className="text-gradient">{getLabel(unit)}</span>
            </span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .countdown-container {
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        
        .countdown-item {
          animation: float 3s infinite ease-in-out;
        }
        
        .countdown-item:nth-child(1) {
          animation-delay: 0s;
        }
        
        .countdown-item:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .countdown-item:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .countdown-item:nth-child(4) {
          animation-delay: 0.6s;
        }
        
        .countdown-value {
          transition: all 0.3s ease;
          transform: perspective(800px) rotateY(0deg);
        }
        
        .countdown-value:hover {
          transform: perspective(800px) rotateY(15deg) scale(1.05);
          box-shadow: 0 10px 20px rgba(91, 33, 182, 0.4);
        }
        
        .text-gradient {
          background: linear-gradient(to right, #f7f7f7, #c5c5c5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        @media (max-width: 640px) {
          .countdown-container {
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
          
          .countdown-value {
            min-width: 3rem;
            min-height: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;