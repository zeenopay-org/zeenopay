import React, { useState, useContext, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";

const VotingCard = ({ contestant, event, onClose }) => {
  const { generateStaticQr } = useContext(EventContext);
  const pageRef = useRef();
  const qr50Ref = useRef(null);
  const qr25Ref = useRef(null);

  const [qr50String, setQr50String] = useState("");
  const [qr25String, setQr25String] = useState("");
  const [loading50, setLoading50] = useState(true);
  const [loading25, setLoading25] = useState(true);
  const [loadingJPG, setLoadingJPG] = useState(false);
  const [eventImageBase64, setEventImageBase64] = useState("");
  const [contestantImageBase64, setContestantImageBase64] = useState("");
  const [error, setError] = useState(null);

  // A4 dimensions in pixels (at 96dpi)
  const A4_WIDTH_PX = 794; // 210mm
  const A4_HEIGHT_PX = 1123; // 297mm

  useEffect(() => {
    const fetchQRs = async () => {
      try {
        setLoading50(true);
        setLoading25(true);
        const [qr50, qr25] = await Promise.all([
          generateStaticQr(contestant.id, 500, event.id),
          generateStaticQr(contestant.id, 250, event.id),
        ]);
        if (qr50?.QR) setQr50String(qr50.QR);
        if (qr25?.QR) setQr25String(qr25.QR);
      } catch (error) {
        console.error("Error generating QR codes:", error);
      } finally {
        setLoading50(false);
        setLoading25(false);
      }
    };
    fetchQRs();
  }, [contestant.id, event.id, generateStaticQr]);

  const renderQRCode = (qrString, ref) => {
    if (qrString && ref.current) {
      ref.current.innerHTML = "";
      const qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        type: "svg",
        data: qrString,
        image: "https://zeenorides.com/zeenopay_logo.svg",
        dotsOptions: { color: "#39b6ff", type: "extra-rounded" },
        backgroundOptions: { color: "" },
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

  useEffect(() => renderQRCode(qr50String, qr50Ref), [qr50String]);
  useEffect(() => renderQRCode(qr25String, qr25Ref), [qr25String]);

  const convertImageToBase64 = async (imgUrl, setBase64) => {
    try {
      const response = await fetch(imgUrl, {
        mode: "cors",
        cache: "no-cache",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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
    if (contestant.avatar)
      convertImageToBase64(contestant.avatar, setContestantImageBase64);
  }, [event.misc_kv, contestant.avatar]);

  const handleDownloadJPG = async () => {
    setError(null);
    setLoadingJPG(true);

    try {
      if (!pageRef.current) throw new Error("Page reference not available");
      if (loading50 || loading25) throw new Error("QR codes still loading");

      // Ensure images are loaded
      const imagePromises = [];
      if (event.misc_kv && !eventImageBase64) {
        imagePromises.push(
          convertImageToBase64(event.misc_kv, setEventImageBase64)
        );
      }
      if (contestant.avatar && !contestantImageBase64) {
        imagePromises.push(
          convertImageToBase64(contestant.avatar, setContestantImageBase64)
        );
      }
      await Promise.all(imagePromises);

      // Create a hidden clone with exact A4 dimensions
      const originalElement = pageRef.current;
      const clone = originalElement.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.width = `${A4_WIDTH_PX}px`;
      clone.style.height = `${A4_HEIGHT_PX}px`;
      clone.style.overflow = "visible";
      document.body.appendChild(clone);

      // Wait for clone to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the clone with html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: null,
      }).catch((e) => {
        throw new Error(`Canvas capture failed: ${e.message}`);
      });

      // Remove the clone
      document.body.removeChild(clone);

      // Convert canvas to JPG and download
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
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
    <div className="fixed inset-0 mt-20 flex items-center justify-center bg-customDarkBlue bg-opacity-10 z-50">
      {/* Scrollable container for A4 content */}
      <div className="relative w-full h-full overflow-auto p-4">
        {/* A4-sized content (will scroll if too large for screen) */}
        <div
          ref={pageRef}
          className="mx-auto bg-white shadow-2xl"
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            backgroundImage: "url('/assets/voting_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={onClose}
            className="absolute text-white px-2 py-1 rounded-full text-xs z-50"
          >
            ✕
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <img
                src="/assets/image 35.png"
                alt="Zeenopay Logo"
                className="h-20 w-auto"
              />
              <div className="text-right">
                <p className="text-sm font-medium">Organized By:</p>
                <p className="text-center text-sm">
                  {event.org !== "N/A" ? event.org : "No bio available"}
                </p>
              </div>
            </div>

            {/* Event Image */}
            <div className="flex justify-center mb-6">
              {eventImageBase64 ? (
                <img
                  src={eventImageBase64}
                  alt="Event"
                  className="w-24 h-24 border-2 object-cover"
                />
              ) : (
                <div className="w-24 h-24 border-2 flex items-center justify-center">
                  Loading event image...
                </div>
              )}
            </div>

            {/* Contestant Image */}
            <div className="relative flex justify-center mb-6">
              {contestantImageBase64 ? (
                <img
                  src={contestantImageBase64}
                  alt="Contestant"
                  className="w-60 h-60 rounded-full border-4 border-blue-600 object-cover"
                />
              ) : (
                <div className="w-60 h-60 rounded-full border-4 border-blue-600 flex items-center justify-center">
                  Loading contestant image...
                </div>
              )}

              {/* Contestant misc_kv Display - Positioned Properly */}
              <div className="absolute top-[70%] right-[280px] transform translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
                {contestant.misc_kv}
              </div>
            </div>

            {/* Contestant Name */}
            <h2 className="text-center text-2xl font-bold mb-8">
              {contestant.name}
            </h2>

            {/* Content Area */}
            <div className="flex">
              {/* Voting Procedure */}
              <div className="w-1/2 pr-6">
                <h3 className="font-bold text-lg mb-4">VOTING PROCEDURE</h3>
                <ol className="list-decimal ml-4 space-y-2 text-sm">
                  <li>Go to zeenopay.com</li>
                  <li>Find your event</li>
                  <li>Click Get Started</li>
                  <li>Select Vote Now</li>
                  <li>Choose your contestant's voting number</li>
                  <li>Enter your details</li>
                  <li>Select your preferred payment method</li>
                  <li>Log in and authenticate via OTP</li>
                  <li>Wait for the Vote Success page</li>
                  <li>Voting is available in Nepal, India, and abroad</li>
                </ol>
              </div>

              {/* QR Codes */}
              <div className="w-1/2 flex  gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold mb-2">50 Votes</p>
                  <div ref={qr50Ref} className="mx-auto"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold mb-2">25 Votes</p>
                  <div ref={qr25Ref} className="mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-8">
              <button
                onClick={handleDownloadJPG}
                className="w-full mt-60 bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 flex justify-center items-center"
                disabled={loading50 || loading25 || loadingJPG}
              >
                {loadingJPG ? (
                  <div className="flex items-center ">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="white"
                        strokeWidth="4"
                      ></path>
                    </svg>
                    Generating JPG...
                  </div>
                ) : (
                  "Download Voting Card (JPG)"
                )}
              </button>
              {error && (
                <div className="text-red-500 text-center mt-2 text-sm">
                  Error: {error}. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingCard;
