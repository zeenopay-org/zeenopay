import React, { useState, useEffect } from 'react';

const ContactUsForm = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds for demo purposes
    }, 500);
  }, []);

  const SkeletonLoader = () => (
    <div className="pt-20  bg-customBlue flex items-center justify-center px-4">
      <form className="bg-customBlue max-w-[85%] w-full space-y-6 animate-pulse">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <div className="h-12 bg-gray-700 rounded-md"></div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <div className="h-12 bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div>
          <div className="h-12 bg-gray-700 rounded-md"></div>
        </div>
        <div>
          <div className="h-24 bg-gray-700 rounded-md"></div>
        </div>
        <div className="flex justify-end">
          <div className="h-12 bg-gray-700 rounded-md w-32"></div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="pt-20  pb-10 bg-customBlue flex items-center justify-center px-4">
          <form className="bg-customBlue max-w-[85%] w-full space-y-6">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2  bg-customSky text-white rounded-md hover:bg-customSky hover:opacity-70 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ContactUsForm;
