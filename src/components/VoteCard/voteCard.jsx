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

  // Responsive scaling factor (0.7 for mobile, 1 for desktop)
  const isMobile = window.innerWidth < 768;
  const scaleFactor = isMobile ? 0.65 : 1;
  const A4_WIDTH_PX = 794 * scaleFactor;
  const A4_HEIGHT_PX = 1123 * scaleFactor;

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
        width: 160 * scaleFactor,
        height: 160 * scaleFactor,
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

  useEffect(() => renderQRCode(qr50String, qr50Ref), [qr50String, scaleFactor]);
  useEffect(() => renderQRCode(qr25String, qr25Ref), [qr25String, scaleFactor]);

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
  
      // Create a clone with original A4 dimensions
      const originalElement = pageRef.current;
      const clone = originalElement.cloneNode(true);
      
      // Remove any scaling transforms
      clone.style.transform = 'none';
      clone.style.width = '794px';
      clone.style.height = '1123px';
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.overflow = "visible";
      clone.style.backgroundColor = "#000";
  
      // Function to scale all numeric style values
      const scaleStyleValues = (element, factor) => {
        if (!element || !element.style) return;
        
        const style = element.style;
        const numericProperties = [
          'width', 'height', 'fontSize', 'marginTop', 'marginBottom', 
          'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom',
          'paddingLeft', 'paddingRight', 'top', 'right', 'bottom', 'left'
        ];
  
        numericProperties.forEach(prop => {
          if (style[prop]) {
            const value = style[prop];
            if (typeof value === 'string' && value.includes('px')) {
              const numericValue = parseFloat(value);
              style[prop] = `${numericValue * factor}px`;
            }
          }
        });
      };
  
      // Scale all elements in the clone
      const elements = clone.querySelectorAll('*');
      elements.forEach(el => {
        scaleStyleValues(el, 1/scaleFactor); // Reverse the mobile scaling
        if (el.style) {
          el.style.color = "#FFF";
        }
      });
  
      // Find the QR code containers in the clone
      const qrContainers = clone.querySelectorAll('.qr-container');
      
      // Increase QR code size specifically for download (25% larger than original)
      const qrDownloadSize = isMobile ? 200 : 160; // Bigger size for mobile download
      
      // Re-render QR codes at larger size for download
      if (qr50String) {
        const qr50Container = clone.querySelector('#qr50-container');
        if (qr50Container) {
          qr50Container.innerHTML = "";
          const qrCode = new QRCodeStyling({
            width: qrDownloadSize,
            height: qrDownloadSize,
            type: "svg",
            data: qr50String,
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
          qrCode.append(qr50Container);
        }
      }
  
      if (qr25String) {
        const qr25Container = clone.querySelector('#qr25-container');
        if (qr25Container) {
          qr25Container.innerHTML = "";
          const qrCode = new QRCodeStyling({
            width: qrDownloadSize,
            height: qrDownloadSize,
            type: "svg",
            data: qr25String,
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
          qrCode.append(qr25Container);
        }
      }
  
      document.body.appendChild(clone);
  
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Give time for rendering
  
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        width: 794,
        height: 1123,
        useCORS: true,
        backgroundColor: "#FFF",
        logging: true,
        allowTaint: true
      });
  
      document.body.removeChild(clone);
  
      const imageData = canvas.toDataURL("image/jpeg", 1.0); // Highest quality
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
    <div className="fixed inset-0 flex items-center justify-center bg-customDarkBlue bg-opacity-50 z-50 overflow-auto">
      <div className="relative md:mt-[550px] w-full h-full flex items-center justify-center p-2">
        <div
          ref={pageRef}
          className="bg-white shadow-2xl mx-aut"
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            backgroundImage: "url('/assets/voting_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `scale(${scaleFactor})`,
            transformOrigin: "center",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs z-50"
            style={{ fontSize: `${12 / scaleFactor}px` }}
          >
            ✕
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <img
                src="/assets/image 35.png"
                alt="Zeenopay Logo"
                style={{ height: `${80 * scaleFactor}px` }}
                className="w-auto"
              />
              <div className="text-right">
                <p
                  className="text-sm font-medium"
                  style={{ fontSize: `${14 * scaleFactor}px` }}
                >
                  Organized By:
                </p>
                <p
                  className="text-center text-sm"
                  style={{ fontSize: `${14 * scaleFactor}px` }}
                >
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
                  style={{
                    width: `${96 * scaleFactor}px`,
                    height: `${96 * scaleFactor}px`,
                  }}
                  className="border-2 object-cover"
                />
              ) : (
                <div
                  style={{
                    width: `${96 * scaleFactor}px`,
                    height: `${96 * scaleFactor}px`,
                  }}
                  className="border-2 flex items-center justify-center"
                >
                  Loading...
                </div>
              )}
            </div>

            {/* Contestant Image */}
            <div className="relative flex justify-center mb-6">
              {contestantImageBase64 ? (
                <img
                  src={contestantImageBase64}
                  alt="Contestant"
                  style={{
                    width: `${200 * scaleFactor}px`,
                    height: `${200 * scaleFactor}px`,
                  }}
                  className="rounded-full border-4 border-blue-600 object-cover"
                />
              ) : (
                <div
                  style={{
                    width: `${240 * scaleFactor}px`,
                    height: `${240 * scaleFactor}px`,
                  }}
                  className="rounded-full border-4 border-blue-600 flex items-center justify-center"
                >
                  Loading...
                </div>
              )}

              <div
                className="absolute transform translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm font-bold shadow-md"
                style={{
                  top: `${70 * scaleFactor}%`,
                  right: `${280 * scaleFactor}px`,
                  fontSize: `${14 * scaleFactor}px`,
                }}
              >
                {contestant.misc_kv}
              </div>
            </div>

            {/* Contestant Name */}
            <h2
              className="text-center font-bold mb-8"
              style={{ fontSize: `${24 * scaleFactor}px` }}
            >
              {contestant.name}
            </h2>

            {/* Content Area */}
            <div className="flex">
              {/* Voting Procedure */}
              <div className="w-1/2 pr-6">
                <h3
                  className="font-bold mb-4"
                  style={{ fontSize: `${18 * scaleFactor}px` }}
                >
                  VOTING PROCEDURE
                </h3>
                <ol
                  className="list-decimal ml-4 space-y-2"
                  style={{ fontSize: `${8 * scaleFactor}px` }}
                >
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
              <div className="w-1/2 flex md:gap-6">
                <div className="text-center qr-container" id="qr50-container">
                  <p
                    className="font-bold mb-2"
                    style={{ fontSize: `${14 * scaleFactor}px` }}
                  >
                    50 Votes
                  </p>
                  <div ref={qr50Ref} className="mx-auto"></div>
                </div>
                <div className="text-center qr-container" id="qr25-container">
                  <p
                    className="font-bold mb-2"
                    style={{ fontSize: `${14 * scaleFactor}px` }}
                  >
                    25 Votes
                  </p>
                  <div ref={qr25Ref} className="mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-80">
              <button
                onClick={handleDownloadJPG}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex justify-center items-center"
                disabled={loading50 || loading25 || loadingJPG}
                style={{
                  marginTop: `${60 * scaleFactor}px`,
                  fontSize: `${18 * scaleFactor}px`,
                }}
              >
                {loadingJPG ? (
                  <div className="flex items-center">
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
                <div
                  className="text-red-500 text-center mt-2"
                  style={{ fontSize: `${14 * scaleFactor}px` }}
                >
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
