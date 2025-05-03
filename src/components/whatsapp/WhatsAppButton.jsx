import React, { useEffect, useState } from "react";

const WhatsAppButton = ({ phoneNumber, message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const popupTimer = setTimeout(() => setIsVisible(true), 200);
    const tooltipTimer = setTimeout(() => setShowTooltip(false), 5000); 

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handleClick = () => {
    const formattedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className={`whatsapp-wrapper ${isVisible ? "show" : ""}`}>
        {showTooltip && (
          <div className="whatsapp-tooltip">
            💬 Chat with us if you have any questions!
          </div>
        )}
        <button onClick={handleClick} className="whatsapp-button" aria-label="Chat on WhatsApp">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="white"
          >
            <path d="M19.11 17.53c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.34.45-.5.15-.17.2-.28.3-.47.1-.2.05-.37-.02-.52-.07-.14-.66-1.6-.9-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.5.07-.76.37-.26.3-1 1-.97 2.42.04 1.4.97 2.77 1.1 2.96.13.2 1.91 2.93 4.64 4.1 2.73 1.18 2.73.79 3.23.75.5-.04 1.6-.64 1.82-1.27.22-.63.22-1.16.15-1.27-.07-.1-.27-.18-.57-.32zM16.04 3C9.4 3 4 8.4 4 15.04c0 2.65.96 5.08 2.55 6.98L4 29l7.22-2.38a11.02 11.02 0 004.82 1.13c6.63 0 12.03-5.4 12.03-12.04S22.68 3 16.04 3zm0 20.97c-1.65 0-3.19-.49-4.47-1.32l-.32-.2-4.29 1.42 1.42-4.18-.21-.33a8.95 8.95 0 01-1.39-4.81c0-4.96 4.03-8.99 8.99-8.99a8.94 8.94 0 018.99 8.99c0 4.96-4.03 9-8.99 9z" />
          </svg>
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        .whatsapp-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          transform: scale(0.5);
          opacity: 0;
          transition: all 0.4s ease-in-out;
        }

        .whatsapp-wrapper.show {
          transform: scale(1);
          opacity: 1;
        }

        .whatsapp-button {
          background-color: #25d366;
          color: white;
          padding: 15px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          animation: jump 1.5s infinite;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        @keyframes jump {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .whatsapp-tooltip {
          background: white;
          color: #333;
          padding: 10px 15px;
          width: 200px;
          border-radius: 10px;
          position: absolute;
          bottom: 70px;
          right: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
