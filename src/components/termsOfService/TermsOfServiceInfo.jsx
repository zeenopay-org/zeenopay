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
        <h1 className="text-xl font-bold">Terms of Service for zeenoPay</h1>
        <p>We hereby establish these Terms and Conditions for the use of zeenoPay to deliver enhanced online ticketing, form submission, and voting services. These terms are intended to minimize potential risks and clearly outline the rights and responsibilities of users while utilizing our services. Please be aware that these Terms and Conditions form a legally binding agreement, equivalent to a physical contract. As such, we request you to carefully read these terms, as future modifications may be made.</p>
        <p>By accepting these Terms and Conditions, you agree comply with all the rules and regulations specified here. Should you choose not to agree, we advise that you refrain from using any of zeenoPay's Electronic Channels or associated services.</p>
        
        <h2 className="text-xl font-bold">Key Definitions:</h2>
        <p>"Visitor" refers to any individual, merchant, or user accessing the zeenoPay website.</p>
        <p>"zeenoPay Web Application" is the online portal accessible via www.zeenoPay.com</p>
        
        <h2 className="text-xl font-bold">Promotions:</h2>
        <p>Any contests, sweepstakes, or other promotions ("Promotions") available through zeenoPay will be governed by rules separate from these Terms. Please review the specific rules for each promotion, along with our Privacy Policy. In the event of any conflict between the Promotion rules and these Terms, the Promotion rules will take precedence.</p>
        
        <h2 className="text-xl font-bold">Content Ownership:</h2>
        <p>All content provided through zeenoPay is owned by zeenoPay or is used with appropriate permission. This content may not be reproduced, modified, transmitted, or repurposed for commercial use without express written consent.</p>
        
        <h2 className="text-xl font-bold">Analytics:</h2>
        <p>We may engage third-party service providers to monitor and analyze how zeenoPay's services are used.</p>
        
        <h2 className="text-xl font-bold">Prohibited Activities:</h2>
        <p>The Service may only be used for lawful purposes. Prohibited activities include, but are not limited to:</p>
        <ul className="list-disc ml-6">
          <li>Engaging in any activity that violates local, national, or international laws.</li>
          <li>Exploiting minors by exposing them to harmful content.</li>
          <li>Sending unsolicited advertising, such as "spam" or chain letters.</li>
          <li>Impersonating zeenoPay staff or other users.</li>
          <li>Engaging in activities that infringe upon others' rights or harm users.</li>
          <li>Conducting activities that disrupt the normal use of the Service.</li>
        </ul>
        
        <h2 className="text-xl font-bold">Age Restriction:</h2>
        <p>Only users 18 years and older may access and use zeenoPay. By using our services, you confirm that you are of legal age and fully capable of adhering to these Terms. Users under the age of 18 are strictly prohibited from accessing or using zeenoPay.</p>
        
        <h2 className="text-xl font-bold">Refund Policy:</h2>
        <p>zeenoPay maintains a clear and fair refund policy as outlined below:</p>
        <p>Eligibility for Refunds</p>
        <p>Once a vote has been successfully cast through zeenoy, it cannot be refunded. Votes are immediately applied, and refunds would compromise the integrity of the voting system.</p>
        <p>Cancellations</p>
        <p>zeenoPay does not accept cancellation requests once a vote has been submitted.</p>
        
        <h2 className="text-xl font-bold">Contact Information:</h2>
        <p>For any inquiries or support requests, please contact us at <a href="mailto:support@zeenoPay.com" className="text-[#2b9af3]">support@zeenoPay.com</a>.</p>
      </div>
    </div>
  );
};

export default TermsOfServiceInfo;
