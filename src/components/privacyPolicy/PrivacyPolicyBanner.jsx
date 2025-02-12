import React, { useState, useEffect } from "react";

const PrivacyPolicyBanner = () => {
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-customBlue w-full flex items-center justify-center">
      <div className="bg-customSky m-8 w-[85%] h-52 flex items-center relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center space-x-4">
            <div className="bg-gray-300 w-32 h-8 animate-pulse rounded"></div>
            <div className="bg-gray-300 w-16 h-16 animate-pulse rounded-full"></div>
          </div>
        ) : (
          <>
            <h1 className="text-white text-3xl ml-20 font-bold">Privacy Policy</h1>
            <div className="absolute bottom-[-60px] right-0 transform -translate-x-1/4 bg-[#2b9af3] rounded-t-full h-24 w-24 md:h-36 md:w-36 flex items-center justify-center border-4 border-[#0c144d]">
              <div className=" h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    width="130"
                    height="130"
                  >
                    <rect width="200" height="200" fill="none" />

                    <rect
                      x="40"
                      y="40"
                      width="60"
                      height="120"
                      rx="8"
                      fill="#F57C00"
                    />
                    <rect
                      x="50"
                      y="60"
                      width="40"
                      height="10"
                      rx="5"
                      fill="#FFFFFF"
                    />
                    <rect
                      x="50"
                      y="80"
                      width="40"
                      height="10"
                      rx="5"
                      fill="#FFFFFF"
                    />
                    <rect
                      x="50"
                      y="100"
                      width="40"
                      height="10"
                      rx="5"
                      fill="#FFFFFF"
                    />

                    <path
                      d="M140 70 L140 110 C140 125 120 140 100 140 C80 140 60 125 60 110 L60 70 L90 50"
                      fill="#F57C00"
                    />

                    <path
                      d="M90 100 L100 110 L120 90"
                      stroke="#FFFFFF"
                      stroke-width="8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyBanner;
