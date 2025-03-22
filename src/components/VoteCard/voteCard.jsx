import React, {useState, useContext, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";

const VotingCard = ({ contestant, event, onClose }) => {


  const {
    getEvent,
    generateStaticQr,

    getContestant,
    loading,
    paymentIframeUrl,
    paymentCurrency,
    getPaymentCurrency,
    initiatePartnerPayment,
    redirectToPaymentPage,
    redirectToFoneAndPrabhuPay,
    redirectToPhonePe,
    getPaymentPartner,
    paymentParnter,
    formData,
    setFormData,
  } = useContext(EventContext);

  console.log("event spd emergency", event);

  const pageRef = useRef();
  const [qrString, setQrString] = useState("");
  const qrRef = useRef(null);
  const handle50VoteQR = async (e) => {
    const intentID = contestant.id;
    const calculatedAmount = 500;
    const eventID = event.id;
    console.log("eventid jndsi :", eventID);
    console.log("intentid jnjhbuyre :", intentID);


        const paymentUrl = await generateStaticQr(intentID, calculatedAmount, eventID);
        if (paymentUrl) {
          console.log("payment URL spd emergency:",paymentUrl);
          
          // setQrString(paymentUrl);
          // setShowQRModal(true);
        } else {
          console.log("Failed to generate Static QR.");
        }

  };
    useEffect(() => {
      handle50VoteQR();
    }, []);

      useEffect(() => {
        if (qrString && qrRef.current) {
          // Clear previous QR code
          console.log("QR jhsbfrbuna", qrString);
          
          qrRef.current.innerHTML = "";
    
          // Create a new QRCodeStyling instance
          const qrCode = new QRCodeStyling({
            width: 332,
            height: 332,
            type: "svg",
            data: qrString,
            image: "https://zeenorides.com/zeenopay_logo.svg",
            dotsOptions: {
                color: "#39b6ff",
                type: "extra-rounded"
            },
            backgroundOptions: {
                color: "#000",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: 0.5,
                margin: 0,
                hideBackgroundDots: false
            }
    
          });
    
          // Append QR code to the ref
          qrCode.append(qrRef.current);
        }
      }, [qrString]);

  const handleDownloadPDF = async () => {
    const input = pageRef.current;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${contestant.name}-Voting-Card.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  return (
    <div className="fixed inset-0 mt-20 flex items-center justify-center bg-customDarkBlue bg-opacity-50 z-[9999]">
      <div
        ref={pageRef}
        className="relative bg-black text-white p-4 w-full max-w-lg rounded-lg shadow-2xl max-h-[100vh] overflow-y-auto z-[10000]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
        >
          ✕
        </button>

        {/* Logos */}
        <div className="flex justify-between items-center">
          <img
            src="/assets/image 35.png"
            alt="Zeenopay Logo"
            className="h-8 w-auto"
          />
          <div className="text-right">
            <p className="text-xs">Organized By:</p>
            <p className="text-center text-xs">
              {event.org !== "N/A" ? event.org : "No bio available"}
            </p>

            {/* <img src="/path-to-organizers-logo.png" alt="Organizers Logo" className="h-8 w-auto" /> */}
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="relative">
            <img
              src={event.misc_kv}
              alt="Event Image"
              className="w-28 h-28 border-2  object-cover"
            />
          </div>
        </div>

        {/* Contestant Avatar */}
        <div className="flex justify-center mt-3">
          <div className="relative">
            <img
              src={contestant.avatar}
              alt="Contestant"
              className="w-40 h-40 rounded-full border-2 border-blue-600"
            />
            <div className="absolute bottom-2 right-2 bg-white text-black px-2 py-1 rounded-full text-sm font-bold">
              {contestant.misc_kv}
            </div>
          </div>
        </div>

        {/* Contestant Details */}
        <h2 className="text-center text-lg font-bold mt-3">
          {contestant.name}
        </h2>
        {/* <p className="text-center text-xs">{contestant.bio !== "N/A" ? contestant.bio : "No bio available"}</p> */}

        {/* QR Codes for Voting */}

        <div className="flex">
          {/* Voting Procedure */}
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

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-xs">50 Votes</p>
              {/* <img
                src={contestant.qr50Votes}
                alt="QR Code for 50 Votes"
                className="w-20 h-20 border border-white"
              /> */}
               <div ref={qrRef}></div>
            </div>
            <div>
              <p className="text-xs">25 Votes</p>
              <img
                src={contestant.qr25Votes}
                alt="QR Code for 25 Votes"
                className="w-20 h-20 border border-white"
              />
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default VotingCard;
