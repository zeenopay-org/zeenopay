import { Crown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../EventProvider";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaCopy,
} from "react-icons/fa";

function ProfileCard({ handleQrClick }) {
  const { contestant, loading, paymentCurrency, getPaymentCurrency } =
    useContext(EventContext);
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  const [player, setPlayer] = useState(null);

  const videoUrl = contestant?.shareable_link || " ";
  useEffect(() => {
    if (!paymentCurrency) {
      getPaymentCurrency();
    }
  }, [paymentCurrency, getPaymentCurrency]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      const newPlayer = new window.YT.Player("youtube-player", {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsIframeVisible(false);
            }
          },
        },
      });
      setPlayer(newPlayer);
    };

    if (isIframeVisible && videoUrl) {
      // Only load the iframe if videoUrl is not empty
      loadYouTubeAPI();
    } else {
      setIsIframeVisible(false); // If videoUrl is empty, hide the iframe
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [isIframeVisible, videoUrl]); // Depend on videoUrl as well

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Copy not supported on this browser.");
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      const videoId = urlObj.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&mute=1&rel=0&iv_load_policy=3`;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent("Check this out!");
  const embedUrl = getEmbedUrl(videoUrl);
  const autoplayEmbedUrl = embedUrl ? `${embedUrl}&autoplay=1` : null;

  return (
    <div>
      {loading ? (
        <div className="md:w-[270px] w-[240px] h-[280px] md:h-[342px] bg-gray-300 rounded-[16px] mx-auto animate-pulse"></div>
      ) : (
        <>
          <div className="md:w-[270px] w-[240px] h-[280px] md:h-[342px] bg-customDarkBlue rounded-[16px] mx-auto border border-white">
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center pt-4 md:pt-8">
                <div className="md:w-[178px] w-[158px] md:h-[168px] h-[158px]">
                  <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-r from-green-500 via-indigo-800 to-purple-600 shadow-xl shadow-sky-400">
                    <motion.div
                      className="absolute inset-0 w-full h-full rounded-full border-4 border-transparent bg-gradient-to-r from-indigo-700 via-purple-500 to-indigo-900 transition-transform duration-300 ease-in-out animate-pulse"
                      animate={{ rotate: 360, opacity: [3, 1, 2] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.img
                      src={contestant.avatar}
                      alt="profile"
                      className="relative w-full h-full rounded-full object-cover cursor-pointer"
                      onClick={() => setIsIframeVisible(true)}
                      loading="lazy"
                      onLoad={() => console.log("Image loaded")}
                      onError={() => console.log("Image failed to load")}
                    />
                    {contestant.misc_kv ? (
                      <div
                        className="absolute top-28 left-32 md:left-36 transform -translate-x-[20%] -translate-y-[12.5%] 
                    bg-customDarkBlue text-white h-10 w-10 
                    text-sm md:text-base flex items-center justify-center 
                    rounded-full border border-transparent bg-gradient-to-r from-indigo-700 via-purple-500 to-indigo-900 
                    transition duration-300 ease-in-out animate-pulse"
                      >
                        {contestant.misc_kv}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2 flex-col items-center">
                  <h3 className="text-[16px] sm:text-[22px] text-white leading-[16px] sm:leading-[24px]">
                    {contestant.name}
                  </h3>
                  <div className="flex justify-center items-center text-white text-[10px] sm:text-[14px] font-normal gap-1 sm:gap-2">
                    <Crown size={16} color="white" />
                    <span>Share link Through</span>
                  </div>
                </div>
              </div>

              {/* Social Media & Copy Link */}
              <div className="flex gap-[10px] text-[14px] sm:text-[16px] justify-center">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-white cursor-pointer" />
                </a>
                <a
                  href={`https://www.facebook.com/dialog/send?link=${currentUrl}&app_id=YOUR_APP_ID&redirect_uri=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookMessenger className="text-white cursor-pointer" />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-white cursor-pointer" />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-white cursor-pointer" />
                </a>

                <a
                  href={`https://wa.me/?text=${shareText}%20${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="text-white cursor-pointer" />
                </a>

                <button
                  onClick={copyToClipboard}
                  className="text-white cursor-pointer"
                >
                  <FaCopy />
                </button>
              </div>

              <div className="w-[80%] md:w-[220px] md:mt-2 -mt-2 h-[1px] bg-white"></div>
            </div>
          </div>
        </>
      )}

      {isIframeVisible && autoplayEmbedUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-full  bg-cyan-500 shadow-lg shadow-cyan-500/50 flex items-center justify-center bg-black bg-opacity-90 z-50"
        >
          <motion.div
            className="w-[300px] h-[400px] bg-white rounded-lg bg-cyan-500 shadow-lg shadow-cyan-500/50   overflow-hidden flex flex-col z-50"
            style={{
              transform: "translate(-50%, -50%)",
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
            drag
            dragConstraints={{
              top: -window.innerHeight / 2,
              left: -window.innerWidth / 2,
              right: window.innerWidth / 2,
              bottom: window.innerHeight / 2,
            }}
            dragElastic={0.1}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
          >
            <iframe
              className="flex-1 w-[300px] h-[400px]"
              id="youtube-player"
              src={autoplayEmbedUrl}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              playsInline
              muted
            ></iframe>
            <button
              onClick={() => setIsIframeVisible(false)}
              className="text-red-500 bg-customDarkBlue hover:text-red-800 p-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ProfileCard;
