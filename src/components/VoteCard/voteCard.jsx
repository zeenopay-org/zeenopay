import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const VotingCard = ({
  eventLogo = "https://i.ibb.co/tKnzfF7/Whats-App-Image-2025-01-01-at-18-32-11-bc7b4020.jpg",
  contestantPicture = "https://i.ibb.co/tKnzfF7/Whats-App-Image-2025-01-01-at-18-32-11-bc7b4020.jpg",
  contestantNumber = "00", // Default contestant number
  contestantName = "Contestant Name", // Default contestant name
  qr50Votes = "https://i.ibb.co/tKnzfF7/Whats-App-Image-2025-01-01-at-18-32-11-bc7b4020.jpg", 
  qr25Votes = "https://i.ibb.co/tKnzfF7/Whats-App-Image-2025-01-01-at-18-32-11-bc7b4020.jpg", 
}) => {
  const cardRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => cardRef.current || document.body,
    documentTitle: `${contestantName}-Voting-Card`,
  });

  return (
    <div className="bg-black text-white p-6 w-full max-w-md mx-auto rounded-lg shadow-lg">
      <div ref={cardRef} className="p-4 bg-black text-white rounded-lg">
        <div className="flex justify-between items-center">
          <div className="bg-blue-600 p-2 rounded">Zeenopay logo</div>
          <div className="bg-blue-600 p-2 rounded">Organizers logo</div>
        </div>
        <div className="flex justify-center mt-4">
          <img src={eventLogo} alt="Event Logo" className="w-16 h-16 rounded-lg" />
        </div>
        <div className="flex justify-center mt-4">
          <div className="relative">
            <img
              src={contestantPicture}
              alt="Contestant"
              className="w-40 h-40 rounded-full border-4 border-blue-600"
            />
            <div className="absolute bottom-0 right-0 bg-white text-black px-2 py-1 rounded-full text-xl font-bold">
              {contestantNumber}
            </div>
          </div>
        </div>
        <h2 className="text-center text-xl font-bold mt-4">{contestantName}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <p className="mb-2">50 Votes</p>
            <iframe src={qr50Votes} className="w-24 h-24 border border-white"></iframe>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2">25 Votes</p>
            <iframe src={qr25Votes} className="w-24 h-24 border border-white"></iframe>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <h3 className="font-bold">VOTING PROCEDURE</h3>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
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
      </div>
      <button
        onClick={handlePrint}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default VotingCard;
