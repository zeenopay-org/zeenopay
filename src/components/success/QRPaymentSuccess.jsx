import React from 'react';
import { useLocation } from 'react-router-dom';

const QRPaymentSuccess = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const txid = urlParams.get('txid'); // Extract txid from URL

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customBlue text-white text-center">
      <div className="bg-green-500 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
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
