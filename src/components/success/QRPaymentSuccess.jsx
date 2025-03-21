import React from 'react';
import { useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const QRPaymentSuccess = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const txid = urlParams.get('txid'); // Extract txid from URL

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customBlue text-white text-center">
      
      {/* Lottie Animation */}
      <div className="w-60 h-60 mb-4">
        <DotLottieReact
          src="/animations/success.lottie" 
          loop
          autoplay
        />
      </div>

      <h1 className="text-2xl font-semibold">Vote Successful!</h1>
      <p>Your votes have been added successfully.</p>
      <p>Your Transaction ID is: <span className="font-bold">{txid || "N/A"}</span></p>
      <p className="mt-2">
        If you have any issues, you can reach us at
        <span className="text-green-400"> +9779705511188 (WhatsApp)</span>.
      </p>
      <p className="mt-4 font-semibold">Best Regards</p>
    </div>
  );
};

export default QRPaymentSuccess;
