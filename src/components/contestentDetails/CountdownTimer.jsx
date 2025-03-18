import { useEffect, useState } from "react";

const CountdownTimer = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex flex-col items-center text-white p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Hurry, Before It's Too Late!
      </h2>
      <div className="flex flex-wrap justify-center space-x-4">
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <div
            key={unit}
            className="flex flex-col items-center animate-[zigzag_1s_infinite]"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="w-20 h-20 bg-white text-orange-900 font-bold text-3xl flex items-center justify-center rounded-xl border-4 border-yellow-600 shadow-lg">
              {value}
            </div>
            <span className="mt-2 text-sm text-gray-300">
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </span>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes zigzag {
            0% { transform: translateY(0); }
            25% { transform: translateY(-5px); }
            50% { transform: translateY(5px); }
            75% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .w-20 {
              width: 4rem;  /* Smaller size for mobile */
              height: 4rem;
            }
            .text-xl {
              font-size: 1.25rem;
            }
            .text-3xl {
              font-size: 2rem;
            }
            .space-x-4 {
              gap: 1rem; /* Adjust spacing for smaller screens */
            }
            .p-6 {
              padding: 1.5rem; /* Adjust padding for mobile */
            }
          }

          @media (max-width: 480px) {
            .w-20 {
              width: 2.5rem;  /* Even smaller for very small screens */
              height: 2.5rem;
            }
            .text-xl {
              font-size: 1.1rem;
            }
            .text-3xl {
              font-size: 1.2rem;
            }
            .p-6 {
              padding: 1rem; /* Further reduce padding */
            }
          }
        `}
      </style>
    </div>
  );
};

export default CountdownTimer;
