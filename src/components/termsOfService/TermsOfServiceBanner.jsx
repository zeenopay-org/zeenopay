import React from "react";

const TermsOfServiceBanner = () => {
  return (
    <div className="bg-customBlue w-full flex items-center justify-center">
      <div className="bg-customSky m-8 w-[85%] h-52 flex items-center relative">
        <h1 className="text-white text-3xl ml-20 font-bold">
          Terms Of Services
        </h1>
        <div className="absolute bottom-[-60px] right-0 transform -translate-x-1/4 bg-[#2b9af3] rounded-t-full h-24 w-24 md:h-36 md:w-36 flex items-center justify-center border-4 border-[#0c144d]">
          <div className="bg-[#ff8820]  h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
            <span className="text-white text-5xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="100"
                height="100"
              >
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  fill="none"
                  rx="10"
                />

                <path
                  d="M30 20 h40 a5 5 0 0 1 5 5 v50 a5 5 0 0 1 -5 5 h-40 a5 5 0 0 1 -5 -5 v-50 a5 5 0 0 1 5 -5 z"
                  fill="#FF8030"
                />

                <rect
                  x="35"
                  y="30"
                  width="30"
                  height="4"
                  fill="#ffffff"
                  rx="2"
                />
                <rect
                  x="35"
                  y="40"
                  width="30"
                  height="4"
                  fill="#ffffff"
                  rx="2"
                />
                <rect
                  x="35"
                  y="50"
                  width="20"
                  height="4"
                  fill="#ffffff"
                  rx="2"
                />

                <path
                  d="M40 60 l5 5 l10 -10"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceBanner;
