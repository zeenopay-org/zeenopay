import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PrivacyPolicyInfo = () => {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500); 
  }, []);

  return (
    <div className="bg-customBlue text-white py-12 px-6">
      <div className="max-w-[85%] mx-auto space-y-6">
        <h1 className="text-xl font-bold">
          {loading ? <Skeleton width={200} /> : 'Privacy Policy for zeenoPay'}
        </h1>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'At zeenoPay, we are fully committed to protecting the privacy and security of our users. This Privacy Policy outlines how we collect, use, share, and safeguard your personal data when you interact with our platform, including our website, mobile applications, and any services associated with zeenoPay.'}
        </p>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton width={300} /> : 'By using zeenoPay\'s services, you acknowledge and agree to the collection and use of information in accordance with this Privacy Policy.'}
        </p>

        <h2 className="text-xl font-bold">
          {loading ? <Skeleton width={150} /> : '1. Information We Collect'}
        </h2>
        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={100} /> : '1.1 Personal Information'}
        </h3>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'When you register for an account, make transactions, or interact with zeenoPay, we collect personal information such as:'}
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(5)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">Name:</span> First and last name to identify you on our platform.</li>
                <li><span className="font-bold">Email address:</span> For account creation, communication, and support purposes.</li>
                <li><span className="font-bold">Phone number:</span> Used for contact, verification, and customer service support.</li>
                <li><span className="font-bold">Payment Information:</span> Including credit card, debit card, mobile wallets, or bank account details to process payments for tickets, votes, forms, and other services. Payment details are stored securely using encryption methods.</li>
                <li><span className="font-bold">Address:</span> For billing purposes or to verify payment methods.</li>
                <li><span className="font-bold">Date of birth:</span> To ensure compliance with our age restriction policies.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={100} /> : '1.2 Non-Personal Information'}
        </h3>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(4)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">IP address:</span> Used for geographical analysis, fraud prevention, and security monitoring.</li>
                <li><span className="font-bold">Browser and Device Information:</span> Including the type of browser, operating system, and device used to access zeenoPay services.</li>
                <li><span className="font-bold">Usage Data:</span> Information about how you use the platform, including your interactions with features, services, and user engagement patterns.</li>
                <li><span className="font-bold">Cookies and Tracking Technologies:</span> We use cookies and similar tracking technologies to monitor your interactions on the platform, enhance your user experience, and provide tailored services.</li>
              </>
            )}
        </ul>

        <h2 className="text-xl font-bold">
          {loading ? <Skeleton width={150} /> : '2. How We Use Your Information'}
        </h2>
        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '2.1 Service Provision'}
        </h3>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">Account creation:</span> We use your information to set up and manage your account.</li>
                <li><span className="font-bold">Transaction processing:</span> Personal data is required to process payments, verify transactions, and confirm purchases like tickets or votes.</li>
                <li><span className="font-bold">Communication:</span> We use your contact information to send you notifications, updates, and alerts about your transactions, service changes, or upcoming events.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '2.2 Legal Compliance and Fraud Prevention'}
        </h3>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(2)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">KYC (Know Your Customer):</span> We may use your personal information to comply with legal regulations and verification procedures, such as age and identity verification.</li>
                <li><span className="font-bold">Fraud detection:</span> We use personal and non-personal information to detect and prevent fraud, suspicious activities, or unauthorized transactions on your account.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '2.3 Service Improvements'}
        </h3>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">Customer support:</span> Your information allows us to respond effectively to inquiries, complaints, or feedback you provide regarding zeenoPay services.</li>
                <li><span className="font-bold">Personalization:</span> We use your data to enhance your user experience by tailoring content, features, or promotions to your preferences and past behaviors.</li>
                <li><span className="font-bold">Analytics:</span> Non-personal data is used for research, analysis, and improving the performance, usability, and security of our services.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '2.4 Marketing and Promotions'}
        </h3>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(2)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold">Marketing communications:</span> With your consent, we may send you promotional emails, newsletters, or offers that align with your interests based on your usage of our services. You can opt-out at any time.</li>
                <li><span className="font-bold">Surveys and feedback:</span> We may contact you to participate in user surveys or provide feedback to improve our services.</li>
              </>
            )}
        </ul>

        <h2 className="text-xl font-bold">
          {loading ? <Skeleton width={150} /> : '3. How We Share Your Information'}
        </h2>
        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '3.1 Service Providers'}
        </h3>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'We may share your information with trusted third-party service providers to help us deliver our services, such as:'}
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li>Payment processors: Third-party payment gateways securely process transactions on our behalf.</li>
                <li>Data analytics providers: To analyze platform usage and improve services.</li>
                <li>Email and SMS communication services: For sending transaction confirmations, alerts, and customer support communications.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '3.2 Legal Obligations'}
        </h3>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'We may disclose your personal data:'}
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li>To comply with applicable laws: When required to do so by law, regulation, or legal process.</li>
                <li>To enforce our terms and policies: If we believe that sharing information is necessary to investigate or remedy potential violations of our policies.</li>
                <li>For fraud prevention: If we detect fraud or security issues, your data may be shared with relevant authorities for investigation.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '3.3 Business Transfers'}
        </h3>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new business entity. In such a case, the new entity will continue to follow this Privacy Policy unless notified otherwise.'}
        </p>

        <h2 className="text-xl font-bold">
          {loading ? <Skeleton width={150} /> : '4. Data Security'}
        </h2>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'We take the security of your personal information seriously. We implement a variety of technical and organizational measures to ensure your data is protected from unauthorized access, disclosure, alteration, and destruction.'}
        </p>

        <h2 className="text-xl font-bold">
          {loading ? <Skeleton width={150} /> : '5. Your Rights'}
        </h2>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'You have the right to access, correct, delete, or object to the processing of your personal data. You can contact us at any time if you wish to exercise any of these rights.'}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyInfo;
