import React from "react";

const ContactUsBanner = () => {
  return (
    <div className="bg-customBlue w-full flex items-center justify-center">
      <div className="bg-customSky m-8 w-[85%] h-52 flex items-center relative">
        <div>
          <h1 className="text-white  text-3xl ml-3 md:ml-20 font-bold">
            Contact Us
          </h1>
          <h2 className="text-white text-sm ml-3 md:ml-20 font-lg">
            {" "}
            Have a question and want to discuss a project? Reach out
            <br />
            We are always open to new opportunity and connections
            <br />
            Fill out the form below or email us directly.
          </h2>
        </div>
        <div className="absolute bottom-[-60px] right-0 transform -translate-x-1/4 bg-[#2b9af3] rounded-t-full h-24 w-24 md:h-36 md:w-36 flex items-center justify-center border-4 border-[#0c144d]">
          <div className=" h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
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
                  d="M50 25 a25 25 0 1 1 -25 25 h5 a20 20 0 1 0 40 0 h5 a25 25 0 1 1 -25 -25"
                  fill="#FF8030"
                />

                <circle cx="30" cy="50" r="6" fill="#FF8030" />
                <circle cx="70" cy="50" r="6" fill="#FF8030" />

                <circle cx="50" cy="50" r="15" fill="#FF8030" />
                <circle cx="43" cy="48" r="2" fill="#FFFFFF" />
                <circle cx="50" cy="48" r="2" fill="#FFFFFF" />
                <circle cx="57" cy="48" r="2" fill="#FFFFFF" />

                <path
                  d="M35 60 l-8 8"
                  stroke="#FF8030"
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

export default ContactUsBanner;
