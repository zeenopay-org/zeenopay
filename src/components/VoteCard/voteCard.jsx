import React, { useState, useContext, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [eventImageBase64, setEventImageBase64] = useState("");
  const [contestantImageBase64, setContestantImageBase64] = useState("");
  const [error, setError] = useState(null);
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
        width: 140,
        height: 140,
        type: "svg",
        data: qrString,
        image: "https://zeenorides.com/zeenopay_logo.svg",
        dotsOptions: { color: "#39b6ff", type: "extra-rounded" },
        backgroundOptions: { color: "#000" },
        imageOptions: { crossOrigin: "anonymous", imageSize: 0.5, margin: 0, hideBackgroundDots: false },
      });
      qrCode.append(ref.current);
    }
  };

  useEffect(() => renderQRCode(qr50String, qr50Ref), [qr50String]);
  useEffect(() => renderQRCode(qr25String, qr25Ref), [qr25String]);

  const convertImageToBase64 = async (imgUrl, setBase64) => {
    try {
      const response = await fetch(imgUrl, {
        mode: 'cors', // Explicitly request CORS
        cache: 'no-cache'
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
      // Fallback to original URL if conversion fails
      setBase64(imgUrl);
      return imgUrl;
    }
  };

  useEffect(() => {
    if (event.misc_kv) convertImageToBase64(event.misc_kv, setEventImageBase64);
    if (contestant.avatar) convertImageToBase64(contestant.avatar, setContestantImageBase64);
  }, [event.misc_kv, contestant.avatar]);

  const handleDownloadPDF = async () => {
    setError(null);
    setLoadingPDF(true);
    
    try {
      // 1. Verify all required data is available
      if (!pageRef.current) throw new Error("Page reference not available");
      if (loading50 || loading25) throw new Error("QR codes still loading");

      // 2. Ensure images are loaded
      const imagePromises = [];
      if (event.misc_kv && !eventImageBase64) {
        imagePromises.push(convertImageToBase64(event.misc_kv, setEventImageBase64));
      }
      if (contestant.avatar && !contestantImageBase64) {
        imagePromises.push(convertImageToBase64(contestant.avatar, setContestantImageBase64));
      }
      await Promise.all(imagePromises);

      // 3. Additional rendering time
      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Capture the canvas
      const canvas = await html2canvas(pageRef.current, {
        scale: window.devicePixelRatio || 1,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: null
      }).catch(e => {
        throw new Error(`Canvas capture failed: ${e.message}`);
      });

      // 5. Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);

      // 6. Handle download
      if (window.navigator.msSaveBlob) { // IE fallback
        const blob = pdf.output("blob");
        window.navigator.msSaveBlob(blob, `${contestant.name}-Voting-Card.pdf`);
      } else {
        pdf.save(`${contestant.name}-Voting-Card.pdf`);
      }

    } catch (err) {
      console.error("PDF generation error:", err);
      setError(err.message);
    } finally {
      setLoadingPDF(false);
    }
  };
  
  return (
    <div className="fixed inset-0 mt-20 flex items-center justify-center bg-customDarkBlue bg-opacity-10 z-50">
      <div 
        ref={pageRef} 
        className="relative p-4 w-full max-w-lg shadow-2xl max-h-[100vh] overflow-y-auto z-50"
        style={{
          backgroundImage: "url('/assets/voting_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button onClick={onClose} className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">✕</button>

        <div className="flex justify-between items-center">
          <img src="/assets/image 35.png" alt="Zeenopay Logo" className="h-14 w-auto" />
          <div className="text-right">
            <p className="text-xs">Organized By:</p>
            <p className="text-center text-xs">{event.org !== "N/A" ? event.org : "No bio available"}</p>
          </div>
        </div>

        <div className="flex justify-center">
          {eventImageBase64 ? <img src={eventImageBase64} alt="Event" className="w-20 h-20 border-2 object-cover" /> : <p>Loading event image...</p>}
        </div>

        <div className="flex justify-center mt-3">
          {contestantImageBase64 ? <img src={contestantImageBase64} alt="Contestant" className="w-40 h-40 rounded-full border-2 border-blue-600" /> : <p>Loading contestant image...</p>}
        </div>

        <h2 className="text-center text-lg font-bold mt-3">{contestant.name}</h2>

        <div className="flex">
          <div className="mt-3 text-[7px]">
            <h3 className="font-bold">VOTING PROCEDURE</h3>
            <ol className="list-decimal ml-4 text-[6px] mt-2 space-y-1">
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
          <div className="mt-3 ml-4 grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-xs mb-2">50 Votes</p>
              <div ref={qr50Ref}></div>
            </div>
            <div>
              <p className="text-xs mb-2">25 Votes</p>
              <div ref={qr25Ref}></div>
            </div>
          </div>
        </div>

        <button 
  onClick={handleDownloadPDF} 
  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 flex justify-center items-center"
  disabled={loading50 || loading25 || loadingPDF}
>
  {loadingPDF ? (
    <div className="flex items-center">
      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"></circle>
        <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4"></path>
      </svg>
      Generating PDF...
    </div>
  ) : "Download as PDF"}
</button>
      </div>
    </div>
  );
};

export default VotingCard;
