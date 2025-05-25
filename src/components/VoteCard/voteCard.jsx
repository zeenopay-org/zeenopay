import React, { useState, useContext, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";

const VotingCard = ({ contestant, event, onClose }) => {
  const { generateStaticQr } = useContext(EventContext);
  const pageRef = useRef();
  const qrRef = useRef(null);

  const [qrString, setQrString] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingJPG, setLoadingJPG] = useState(false);
  const [eventImageBase64, setEventImageBase64] = useState("");
  const [contestantImageBase64, setContestantImageBase64] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        setLoading(true);
        const qrData = await generateStaticQr(contestant.id, 0, event.id);
        if (qrData?.QR) setQrString(qrData.QR);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, [contestant.id, event.id, generateStaticQr]);

  const renderQRCode = (qrString, ref) => {
    if (qrString && ref.current) {
      ref.current.innerHTML = "";
      const qrCode = new QRCodeStyling({
        width: 180,
        height: 180,
        type: "svg",
        data: qrString,
        image: "https://zeenorides.com/zeenopay_logo.svg",
        dotsOptions: { color: "#39b6ff", type: "extra-rounded" },
        backgroundOptions: { color: "#000" },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.5,
          margin: 0,
          hideBackgroundDots: false,
        },
      });
      qrCode.append(ref.current);
    }
  };

  useEffect(() => renderQRCode(qrString, qrRef), [qrString]);

  const convertImageToBase64 = async (imgUrl, setBase64) => {
    try {
      const response = await fetch(imgUrl, {
        mode: "cors",
        cache: "no-cache",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64(reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setBase64(imgUrl);
      return imgUrl;
    }
  };

  useEffect(() => {
    if (event.misc_kv) convertImageToBase64(event.misc_kv, setEventImageBase64);
    if (contestant.avatar) convertImageToBase64(contestant.avatar, setContestantImageBase64);
  }, [event.misc_kv, contestant.avatar]);

  const handleDownloadJPG = async () => {
    setError(null);
    setLoadingJPG(true);

    try {
      if (!pageRef.current) throw new Error("Page reference not available");
      if (loading) throw new Error("QR code still loading");

      const imagePromises = [];
      if (event.misc_kv && !eventImageBase64) {
        imagePromises.push(convertImageToBase64(event.misc_kv, setEventImageBase64));
      }
      if (contestant.avatar && !contestantImageBase64) {
        imagePromises.push(convertImageToBase64(contestant.avatar, setContestantImageBase64));
      }
      await Promise.all(imagePromises);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#000B44",
        logging: false,
        allowTaint: true,
      });

      const imageData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${contestant.name}-Voting-Card.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("JPG generation error:", err);
      setError(err.message);
    } finally {
      setLoadingJPG(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="relative w-full max-w-3xl mx-auto">
        <div
          ref={pageRef}
          className="text-white rounded-xl shadow-2xl overflow-hidden relative"
          style={{
            background: `
              linear-gradient(135deg, 
                #000B44 0%, 
                #001a66 25%, 
                #002d88 50%, 
                #001966 75%, 
                #000822 100%
              ),
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
            `,
          }}
        >
          {/* Close Button - Hidden during download */}
          {!loadingJPG && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl z-50 bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          )}

          {/* Header Section */}
          <div className="px-3 pt-3 pb-2 text-center border-b border-white/10">
            <h1 className="text-lg font-bold mb-1 text-blue-200">Multiple Votes are accepted!</h1>
            <p className="text-xs opacity-90 mb-1">
              Use this QR code to vote multiple times. Screenshot and share!
            </p>
            <p className="text-xs opacity-80 bg-blue-900/30 px-2 py-1 rounded-full inline-block">
              (Mobile Banking Apps only)
            </p>
          </div>

          {/* Main Content */}
          <div className="px-3 py-3">
            {/* Top Section with Logo and Event Info */}
            <div className="flex justify-between items-center mb-3 rounded-lg p-2">
              <div className="flex items-center">
                <img 
                  src="https://media.zeenopay.com/ZEENOPAY_MAIN_LOGO_BLUE.PNG" 
                  alt="zeenoPay Logo"
                  className="w-18 h-14"
                />
              </div>
              <div className="text-right">
                <p className="text-xs opacity-90">Event Organized By:</p>
                <p className="text-xs font-bold text-blue-200">
                  {event?.org !== "N/A" && event?.org ? event.org : "ABC EVENTS PVT LTD."}
                </p>
              </div>
            </div>

            {/* Event Logo and Name */}
            <div className="text-center mb-3">
              <div className="inline-block bg-white rounded-full p-1 mb-1 shadow-lg">
                {eventImageBase64 ? (
                  <img
                    src={eventImageBase64}
                    alt="Event Logo"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center text-black font-bold text-xs">
                    EVENT<br />LOGO
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold uppercase text-white">
                {event?.title || "EVENT NAME FALANO"}
              </h2>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              
              {/* Left Column - Contestant and Voting Procedure */}
              <div className="space-y-3">
                {/* Contestant Info */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="relative inline-block mb-2">
                    {contestantImageBase64 ? (
                      <img
                        src={contestantImageBase64}
                        alt="Contestant"
                        className="w-28 h-26 object-cover rounded-lg border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-28 h-20 bg-gray-300 rounded-lg border-2 border-white/30 flex items-center justify-center text-gray-600 text-xs">
                        Loading...
                      </div>
                    )}
                    {contestant?.misc_kv && (
                      <div className="absolute -bottom-1 -right-1 bg-white text-black px-2 py-0.5 rounded-full text-xs font-bold">
                        {contestant.misc_kv}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {contestant?.name || "Keta Keti Ko Naam"}
                  </h3>
                  <div className="h-0.5 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </div>

                {/* Voting Procedure */}
                <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                  <h4 className="font-bold text-center mb-2 text-sm border-b border-white/20 pb-1 text-blue-200">
                    VOTING PROCEDURE
                  </h4>
                  <ol className="text-xs space-y-0.5 list-decimal list-inside text-gray-200">
                    <li>Go to <span className="font-semibold text-blue-300">zeenopay.com</span></li>
                    <li>Find your event</li>
                    <li>Click <span className="font-semibold text-green-300">Get Started</span></li>
                    <li>Select <span className="font-semibold text-green-300">Vote Now</span></li>
                    <li>Choose contestant's voting number</li>
                    <li>Enter your details & payment method</li>
                    <li>Login and authenticate via OTP</li>
                    <li>Wait for Vote Success page</li>
                    <li className="text-yellow-300 font-semibold">Available globally</li>
                  </ol>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-3">
                <div className="mb-3">
                  <div className="text-center">
                    <div ref={qrRef} className="flex justify-center mb-2 p-2 rounded-lg">
                      {loading && (
                        <div className="w-36 h-36 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Loading QR...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Instructions */}
                <div className="text-center">
                  <h3 className="text-[12px] font-bold mb-1 text-blue-200">
                    SCAN THIS QR CODE THROUGH
                  </h3>
                  <h4 className="text-[12px] font-bold mb-2 text-white">
                    BANK ACCOUNT APP TO VOTE
                  </h4>

                  <div className="text-xs space-y-1 bg-black/30 rounded-lg p-2">
                    <p>
                      <span className="font-bold text-red-400">Note:</span> 
                      <span className="text-gray-200"> Min vote is 1, no limits.</span>
                    </p>
                    <p className="text-gray-200">Vote multiple times with any amount.</p>
                    <p className="font-bold text-yellow-300 text-[10px]">One Vote = 10 Rs.</p>
                    <p className="font-bold text-white text-[10px]">Amount divisible by 10.</p>
                    <p className="font-regular text-white text-[8px] mt-1 opacity-80">Terms & Conditions apply.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button - Hidden during download */}
            {!loadingJPG && (
              <div className="mt-3 text-center border-t border-white/10 pt-3">
                <button
                  onClick={handleDownloadJPG}
                  className="bg-white hover:from-blue-600 hover:to-purple-700 text-black font-bold py-2 px-6 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 uppercase"
                  disabled={loading || loadingJPG}
                >
                  DOWNLOAD POSTER
                </button>
                {error && (
                  <div className="text-red-300 text-xs mt-2 bg-red-900/20 px-3 py-1 rounded-lg inline-block">
                    Error: {error}. Please try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingCard;