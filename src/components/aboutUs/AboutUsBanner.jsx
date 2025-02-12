import React, { useState, useEffect } from 'react';

const AboutUsBanner = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const SkeletonLoader = () => (
    <div className="bg-customBlue w-full flex items-center justify-center">
      <div className="bg-customSky m-8 w-[85%] h-52 flex items-center relative animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/4 ml-20"></div>
        <div className="absolute bottom-[-60px] right-0 transform -translate-x-1/4 bg-[#2b9af3] rounded-t-full h-24 w-24 md:h-36 md:w-36 flex items-center justify-center border-4 border-[#0c144d]">
          <div className="bg-[#ff8820] rounded-full h-14 w-14 md:h-16 md:w-16 flex items-center justify-center"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="bg-customBlue w-full flex items-center justify-center">
          <div className="bg-customSky m-8 w-[85%] h-52 flex items-center relative">
            <h1 className="text-white text-3xl ml-20 font-bold">About Us</h1>
            <div className="absolute bottom-[-60px] right-0 transform -translate-x-1/4 bg-[#2b9af3] rounded-t-full h-24 w-24 md:h-36 md:w-36 flex items-center justify-center border-4 border-[#0c144d]">
              <div className="bg-[#ff8820] rounded-full h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">i</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUsBanner;
