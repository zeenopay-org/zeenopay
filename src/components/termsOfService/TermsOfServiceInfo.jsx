import React, { useState, useEffect } from "react";

const SkeletonLoader = () => {
  return (
    <div className="bg-customBlue text-white py-12 px-6">
      <div className="max-w-[85%] mx-auto space-y-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TermsOfServiceInfo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="bg-customBlue text-white py-12 px-6">
      <div className="max-w-[85%] mx-auto space-y-6">
        <h1 className="text-xl font-bold">Terms of Service - ZeenoPay</h1>
        <p className="text-sm text-gray-500">
          We hereby establish these Terms and Conditions for the use of ZeenoPay to deliver enhanced online ticketing, form submission, and voting services...
        </p>
        
        <h2 className="text-xl font-bold">Key Definitions</h2>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          <li><span className="font-bold">Visitor</span> refers to any individual, merchant, or user accessing the ZeenoPay website.</li>
          <li><span className="font-bold">ZeenoPay Web Application</span> is the online portal accessible via www.zeenoPay.com.</li>
        </ul>

        <h2 className="text-xl font-bold">Refund Policy</h2>
        <p className="text-gray-500">
          ZeenoPay maintains a clear and fair refund policy as outlined below:
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          <li><span className="font-bold">Eligibility for Refund</span>: Once a vote has been successfully cast through ZeenoPay, it cannot be refunded.</li>
          <li><span className="font-bold">Cancellations</span>: ZeenoPay does not accept cancellation requests once a vote has been submitted.</li>
        </ul>

        <h2 className="text-xl font-bold">Contact Information</h2>
        <p className="text-gray-500">
          For any inquiries or support requests, please contact us at <a href="mailto:support@zeenoPay.com" className="text-[#2b9af3]">support@zeenoPay.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServiceInfo;
