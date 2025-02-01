import { Crown } from "lucide-react";
import { useContext } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { EventContext } from "../../EventProvider";

function ProfileCard({ img }) {
  const { contestant } = useContext(EventContext);

  return (
    <div className="w-36 h-44 sm:w-[252px] sm:h-[322px] bg-[#01245c] rounded-[24px] mx-auto">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center pt-4 md:pt-8">
          <div className="w-[56px] h-[56px] sm:w-[128px] sm:h-[132px]">
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
        <div className=" w-[80%]   md:w-[220px] md:mt-2 -mt-2 h-[1px] bg-white"></div>
      </div>
    </div>
  );
}

export default ProfileCard;
