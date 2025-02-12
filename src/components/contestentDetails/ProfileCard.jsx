import { Crown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { EventContext } from "../../EventProvider";

function ProfileCard({ handleQrClick }) {
  const { contestant, loading, paymentCurrency, getPaymentCurrency } =
    useContext(EventContext);

  useEffect(() => {
    if (!paymentCurrency) {
      getPaymentCurrency();
    }
  }, [paymentCurrency, getPaymentCurrency]);

  const renderSkeletonLoader = () => (
    <div className="w-36 h-44 sm:w-[252px] sm:h-[322px] bg-gray-300 rounded-[24px] mx-auto animate-pulse">
      <div className="flex flex-col gap-4 justify-center items-center p-4">
        <div className="w-[56px] h-[56px] sm:w-[128px] sm:h-[132px] bg-gray-500 rounded-full"></div>
        <div className="flex gap-2 flex-col items-center">
          <div className="h-6 w-3/4 bg-gray-500 rounded-full"></div>
          <div className="h-4 w-3/4 bg-gray-500 rounded-full mt-2"></div>
        </div>
        <div className="flex gap-[10px] text-[14px] sm:text-[16px] justify-center mt-4">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {loading ? (
        renderSkeletonLoader()
      ) : (
        <div className="md:w-[262px] w-[200px] h-[280px] md:h-[342px] bg-[#01245c] rounded-[16px] mx-auto border border-white">
          {contestant?.misc_kv && (
            <div className="absolute top-2 left-3  transform -translate-x-[20%] -translate-y-[12.5%] bg-[#009BE2] text-white h-16 w-12 md:h-24 md:w-20 text-[28px] md:text-[36px]  px-3 py-1 sm:px-4 sm:py-2 rounded-br-full rounded-tl-2xl">
              {contestant.misc_kv}
            </div>
          )}

          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col gap-4 justify-center items-center pt-4 md:pt-8">
              <div className="md:w-[178px] w-[158px] md:h-[168px] h-[158px] ">
                <img
                  src={contestant.avatar}
                  className="w-full h-full block rounded-full object-cover"
                  alt="profile"
                />
              </div>
              <div className="flex gap-2 flex-col items-center">
                <div className="text-[16px] sm:text-[22px] text-white leading-[16px] sm:leading-[24px]">
                  <h3>{contestant.name}</h3>
                </div>
                <div className="flex justify-center items-center text-white text-[10px] sm:text-[14px] font-normal gap-1 sm:gap-2 leading-[16px] sm:leading-[20px]">
                  <Crown size={16} color="white" />
                  <span>share via link</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-[10px] text-[14px] sm:text-[16px] justify-center">
                <FaFacebook className="text-white" />
                <FaTwitter className="text-white" />
                <FaInstagram className="text-white" />
                <FaWhatsapp className="text-white" />
              </div>
            </div>
            <div className=" w-[80%] md:w-[220px] md:mt-2 -mt-2 h-[1px] bg-white"></div>
          </div>
          {paymentCurrency.cc === "np" && (
            <button
              onClick={handleQrClick}
              className="w-full bg-[#01245c] border-white border-[1px] md:mt-8 mt-[18px]  p-2 rounded-[15px]"
            >
              Generate Qr to Vote
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
