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
        <h1 className="text-xl font-bold text-white">
          {loading ? <Skeleton width={200} /> : 'Privacy Policy for zeenoPay'}
        </h1>
        
        {/* Existing Privacy Policy Content Here */}
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'At zeenoPay, we are fully committed to protecting the privacy and security of our users. This Privacy Policy outlines how we collect, use, share, and safeguard your personal data when you interact with our platform, including our website, mobile applications, and any services associated with zeenoPay.'}
        </p>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton width={300} /> : 'By using zeenoPay\'s services, you acknowledge and agree to the collection and use of information in accordance with this Privacy Policy.'}
        </p>

        <h2 className="text-xl font-bold text-white">
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
                <li><span className="font-bold text-white">Name:</span> First and last name to identify you on our platform.</li>
                <li><span className="font-bold text-white">Email address:</span> For account creation, communication, and support purposes.</li>
                <li><span className="font-bold text-white">Phone number:</span> Used for contact, verification, and customer service support.</li>
                <li><span className="font-bold text-white">Payment Information:</span> Including credit card, debit card, mobile wallets, or bank account details to process payments for tickets, votes, forms, and other services. Payment details are stored securely using encryption methods.</li>
                <li><span className="font-bold text-white">Address:</span> For billing purposes or to verify payment methods.</li>
                <li><span className="font-bold text-white">Date of birth:</span> To ensure compliance with our age restriction policies.</li>
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
                <li><span className="font-bold text-white">IP address:</span> Used for geographical analysis, fraud prevention, and security monitoring.</li>
                <li><span className="font-bold text-white">Browser and Device Information:</span> Including the type of browser, operating system, and device used to access zeenoPay services.</li>
                <li><span className="font-bold text-white">Usage Data:</span> Information about how you use the platform, including your interactions with features, services, and user engagement patterns.</li>
                <li><span className="font-bold text-white">Cookies and Tracking Technologies:</span> We use cookies and similar tracking technologies to monitor your interactions on the platform, enhance your user experience, and provide tailored services.</li>
              </>
            )}
        </ul>

        <h2 className="text-xl font-bold text-white">
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
                <li><span className="font-bold text-white">Account creation:</span> We use your information to set up and manage your account.</li>
                <li><span className="font-bold text-white">Transaction processing:</span> Personal data is required to process payments, verify transactions, and confirm purchases like tickets or votes.</li>
                <li><span className="font-bold text-white">Communication:</span> We use your contact information to send you notifications, updates, and alerts about your transactions, service changes, or upcoming events.</li>
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
                <li><span className="font-bold text-white">KYC (Know Your Customer):</span> We may use your personal information to comply with legal regulations and verification procedures, such as age and identity verification.</li>
                <li><span className="font-bold text-white">Fraud detection:</span> We use personal and non-personal information to detect and prevent fraud, suspicious activities, or unauthorized transactions on your account.</li>
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
                <li><span className="font-bold text-white">Customer support:</span> Your information allows us to respond effectively to inquiries, complaints, or feedback you provide regarding zeenoPay services.</li>
                <li><span className="font-bold text-white">Personalization:</span> We use your data to enhance your user experience by tailoring content, features, or promotions to your preferences and past behaviors.</li>
                <li><span className="font-bold text-white">Analytics:</span> Non-personal data is used for research, analysis, and improving the performance, usability, and security of our services.</li>
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
                <li><span className="font-bold text-white">Marketing communications:</span> With your consent, we may send you promotional emails, newsletters, or offers that align with your interests based on your usage of our services. You can opt-out at any time.</li>
                <li><span className="font-bold text-white">Surveys and feedback:</span> We may contact you to participate in user surveys or provide feedback to improve our services.</li>
              </>
            )}
        </ul>

        <h2 className="text-xl font-bold text-white">
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
                <li> <span className="font-bold text-white"> Payment processors:</span> Third-party payment gateways securely process transactions on our behalf.</li>
                <li> <span className="font-bold text-white">  Data analytics providers:</span> To analyze platform usage and improve services.</li>
                <li> <span className="font-bold text-white"> Email and SMS communication services:</span> For sending transaction confirmations, alerts, and customer support communications.</li>
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
                <li> <span className="font-bold text-white"> To comply with applicable laws:</span> When required to do so by law, regulation, or legal process.</li>
                <li> <span className="font-bold text-white"> To enforce our terms and policies: </span>If we believe that sharing information is necessary to investigate or remedy potential violations of our policies.</li>
                <li> <span className="font-bold text-white"> For fraud prevention: </span>If we detect fraud or security issues, your data may be shared with relevant authorities for investigation.</li>
              </>
            )}
        </ul>

        <h3 className="text-lg font-semibold">
          {loading ? <Skeleton width={120} /> : '3.3 Business Transfers'}
        </h3>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new business entity. In such a case, the new entity will continue to follow this Privacy Policy unless notified otherwise.'}
        </p>

        
        <h2 className="text-xl font-bold text-white">
          {loading ? <Skeleton width={150} /> : '4. Data Security'}
        </h2>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'At zeenoPay, we implement industry-standard security measures to safeguard your data, including:'}
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold text-white">Encryption:</span> All sensitive data, including payment information, is encrypted during transmission using SSL (Secure Socket Layer) technology.</li>
                <li><span className="font-bold text-white">Data access controls:</span> Only authorized personnel have access to your personal data, and their access is restricted based on their roles and responsibilities.</li>
                <li><span className="font-bold text-white">Regular security assessments:</span> We conduct periodic audits and assessments of our systems to ensure they remain secure against vulnerabilities.</li>
              </>
            )}
        </ul>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'While we strive to protect your personal data, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.'}
        </p>
        
        <h2 className="text-xl font-bold text-white">
          {loading ? <Skeleton width={150} /> : '5. Data Retention'}
        </h2>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={3} /> : 'We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including:'}
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          {loading
            ? [...Array(3)].map((_, index) => <li key={index}><Skeleton width={300} /></li>)
            : (
              <>
                <li><span className="font-bold text-white">Legal and compliance obligations:</span> To comply with legal, tax, or regulatory requirements.</li>
                <li><span className="font-bold text-white">Service provision:</span> As long as you have an active account or continue to use our services.</li>
                <li><span className="font-bold text-white">Marketing purposes:</span> Until you opt out of receiving promotional communications.</li>
              </>
            )}
        </ul>
        <p className="text-sm text-gray-500">
          {loading ? <Skeleton count={2} /> : 'After the retention period ends, we will securely delete or anonymize your personal data.'}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyInfo;
