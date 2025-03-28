import React, { useState, useContext, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";

const VotingCard = ({ contestant, event, onClose }) => {
  const { generateStaticQr } = useContext(EventContext);

  const pageRef = useRef();
  const [qr50String, setQr50String] = useState("");
  const [qr25String, setQr25String] = useState("");
  const [loading50, setLoading50] = useState(true);
  const [loading25, setLoading25] = useState(true);
  const qr50Ref = useRef(null);
  const qr25Ref = useRef(null);

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
      ref.current.innerHTML = ""; // Clear previous QR
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

  const convertImageToBase64 = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (error) => reject(error);
    });
  };

  const handleDownloadPDF = async () => {
    try {
      if (loading50 || loading25) {
        console.error("QR Codes are still loading");
        return;
      }
  
      if (!pageRef.current) {
        console.error("Reference to pageRef is null");
        return;
      }
  
      // Hide the download button before capturing
      const downloadBtn = pageRef.current.querySelector("#download-button");
      if (downloadBtn) downloadBtn.style.display = "none";
  
      const avatarBase64 = contestant.avatar ? await convertImageToBase64(contestant.avatar) : "";
      const eventBase64 = event.misc_kv ? await convertImageToBase64(event.misc_kv) : "";
  
      // Replace img src with base64 if available
      const avatarImg = document.querySelector(`img[src="${contestant.avatar}"]`);
      const eventImg = document.querySelector(`img[src="${event.misc_kv}"]`);
  
      if (avatarImg && avatarBase64) avatarImg.src = avatarBase64;
      if (eventImg && eventBase64) eventImg.src = eventBase64;
  
      // Wait a moment for images to load
      setTimeout(async () => {
        const canvas = await html2canvas(pageRef.current, { scale: 2, useCORS: true, logging: false, allowTaint: true });
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${contestant.name}-Voting-Card.pdf`);
  
        // Show the download button again after saving
        if (downloadBtn) downloadBtn.style.display = "block";
      }, 500);
    } catch (error) {
      console.error("Failed to generate PDF", error);
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
          <img src={event.misc_kv} alt="Event" className="w-20 h-20 border-2 object-cover" />
        </div>

        <div className="flex justify-center mt-3">
          <img src={contestant.avatar} alt="Contestant" className="w-40 h-40 rounded-full border-2 border-blue-600" />
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
              {loading50 ? (
                <div className="w-[140px] h-[140px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div ref={qr50Ref}></div>
              )}
            </div>
            <div>
              <p className="text-xs mb-2">25 Votes</p>
              {loading25 ? (
                <div className="w-[140px] h-[140px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div ref={qr25Ref}></div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownloadPDF} 
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
          disabled={loading50 || loading25}
        >
          {loading50 || loading25 ? "Generating QR Codes..." : "Download as PDF"}
        </button>
      </div>
    </div>
  );
};

export default VotingCard;