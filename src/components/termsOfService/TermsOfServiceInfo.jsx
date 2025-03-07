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
        <p className="text-sm text-gray-500">
          We hereby establish these Terms and Conditions for the use of zeenoPay
          to deliver enhanced online ticketing, form submission, and voting
          services. These terms are intended to minimize potential risks and
          clearly outline the rights and responsibilities of users while
          utilizing our services. Please be aware that these Terms and
          Conditions form a legally binding agreement, equivalent to a physical
          contract. As such, we request you to carefully read these terms, as
          future modifications may be made.
        </p>
        <p className="text-sm text-gray-500">
          By accepting these Terms and Conditions, you agree comply with all the
          rules and regulations specified here. Should you choose not to agree,
          we advise that you refrain from using any of zeenoPay's Electronic
          Channels or associated services.
        </p>

        <h2 className="text-xl font-bold">Key Definitions:</h2>
        <p className="text-sm text-gray-500">
          {" "}
          <span className="font-bold text-white"> "Visitor"</span> refers to any
          individual, merchant, or user accessing the zeenoPay website.
        </p>
        <p className="text-sm text-gray-500">
          {" "}
          <span className="font-bold text-white">
            "zeenoPay Web Application"{" "}
          </span>{" "}
          is the online portal accessible via www.zeenoPay.com
        </p>

        <h2 className="text-xl font-bold">Promotions:</h2>
        <p className="text-sm text-gray-500">
          {" "}
          Any contests, sweepstakes, or other promotions ("Promotions")
          available through zeenoPay will be governed by rules separate from
          these Terms. Please review the specific rules for each promotion,
          along with our Privacy Policy. In the event of any conflict between
          the Promotion rules and these Terms, the Promotion rules will take
          precedence.
        </p>

        <h2 className="text-xl font-bold">Content Ownership:</h2>
        <p className="text-sm text-gray-500">
          {" "}
          All content provided through zeenoPay is owned by zeenoPay or is used
          with appropriate permission. This content may not be reproduced,
          modified, transmitted, or repurposed for commercial use without
          express written consent.
        </p>

        <h2 className="text-xl font-bold">Analytics:</h2>
        <p className="text-sm text-gray-500">
          We may engage third-party service providers to monitor and analyze how
          zeenoPay's services are used.
        </p>

        <h2 className="text-xl font-bold">Prohibited Activities:</h2>
        <p className="text-sm text-gray-500">
          The Service may only be used for lawful purposes. Prohibited
          activities include, but are not limited to:
        </p>
        <ul className=" text-sm text-gray-500 list-disc ml-6">
          <li>
            Engaging in any activity that violates local, national, or
            international laws.
          </li>
          <li>Exploiting minors by exposing them to harmful content.</li>
          <li>
            Sending unsolicited advertising, such as "spam" or chain letters.
          </li>
          <li>Impersonating zeenoPay staff or other users.</li>
          <li>
            Engaging in activities that infringe upon others' rights or harm
            users.
          </li>
          <li>
            Conducting activities that disrupt the normal use of the Service.
          </li>
        </ul>

        <h2 className="text-xl font-bold">Age Restriction:</h2>
        <p className="text-sm text-gray-500">
          Only users 18 years and older may access and use zeenoPay. By using
          our services, you confirm that you are of legal age and fully capable
          of adhering to these Terms. Users under the age of 18 are strictly
          prohibited from accessing or using zeenoPay.
        </p>
        <h2 className="text-sm font-bold">Refund Policy</h2>
        <p className="text-sm text-gray-500">
          zeenoPay maintains a clear and fair refund policy as outlined below.
        </p>

        <h2 className="text-sm font-bold">Eligibility for Refunds</h2>
        <p className="text-sm text-gray-500">
          Once a vote has been successfully cast through zeenoPay, it cannot be
          refunded. Votes are immediately applied, and refunds would compromise
          the integrity of the voting system.
        </p>

        <h2 className="text-sm font-bold">Cancellations</h2>
        <p className="text-sm text-gray-500">
          zeenoPay does not accept cancellation requests once a vote has been
          submitted.
        </p>

        <h2 className="text-sm font-bold">Disputed Transactions</h2>
        <p className="text-sm text-gray-500">
          In cases of unauthorized or disputed transactions, contact our support
          team for resolution. We will investigate and take appropriate actions.
        </p>

        <h2 className="text-sm font-bold">Exceptional Cases</h2>
        <p className="text-sm text-gray-500">
          In rare situations where technical issues impact the voting process,
          zeenoPay may consider refunds or compensations on a case-by-case
          basis.
        </p>

        <h2 className="text-sm font-bold">Updates to Policy</h2>
        <p className="text-sm text-gray-500">
          We reserve the right to update this policy. Users will be notified of
          any changes through our website.
        </p>

        <h2 className="text-xl font-bold">Online Voting</h2>
        <p className="text-sm text-gray-500">
          Voting events hosted on zeenoPay are governed by agreements with event
          organizers. Payments for votes are processed via digital channels, and
          the payment process is final and cannot be reversed.
        </p>

        <h2 className="text-xl font-bold">Online Ticketing</h2>
        <p className="text-sm text-gray-500">
          Tickets sold through zeenoPay are non-refundable. Payments processed
          through digital channels are final. Once a payment is successful,
          users are not entitled to a refund.
        </p>

        <h2 className="text-xl font-bold">Online Form Submission</h2>
        <p className="text-sm text-gray-500">
          Forms submitted through zeenoPay cannot be canceled, and all payments
          made through digital channels are final and non-refundable.
        </p>

        <h2 className="text-xl font-bold">Feedback and Error Reporting</h2>
        <p className="text-sm text-gray-500">
          Users may provide feedback or report errors to support@zeenoPay.com.
          By submitting feedback, you agree that:
        </p>
        <ul className="text-sm text-gray-500">
          <li>You do not retain any rights over the feedback.</li>
          <li>zeenoPay may already be working on similar ideas.</li>
          <li>Feedback is not considered confidential.</li>
        </ul>

        <h2 className="text-xl font-bold">Intellectual Property</h2>
        <p className="text-sm text-gray-500">
          All original content, features, and functionality of zeenoPay remain
          the exclusive property of zeenoPay and its licensors. Unauthorized use
          of zeenoPay's intellectual property is prohibited.
        </p>

        <h2 className="text-xl font-bold">Service Modifications</h2>
        <p className="text-sm text-gray-500">
          We reserve the right to modify or discontinue any aspect of zeenoPay
          at our discretion, without notice.
        </p>

        <h2 className="text-xl font-bold">Secure Data Handling and Privacy</h2>
        <p className="text-sm text-gray-500">
          zeenoPay prioritizes the secure handling of user data. We only collect
          essential information such as name, phone number, and email for KYC
          purposes. All user data is treated with confidentiality and is not
          shared with third parties.
        </p>

        <h2 className="text-xl font-bold">Location Verification</h2>
        <p className="text-sm text-gray-500">
          For security purposes, zeenoPay may track users' locations during the
          voting process to verify the authenticity of votes. This information
          is protected and used solely for verification purposes.
        </p>

        <h2 className="text-xl font-bold">Amendments</h2>
        <p className="text-sm text-gray-500">
          These Terms may be updated periodically. It is the responsibility of
          users to stay informed of changes. Continued use of zeenoPay after
          revisions signifies acceptance of the new terms.
        </p>

        <h2 className="text-xl font-bold">Copyright Policy</h2>
        <p className="text-sm text-gray-500">
          We respect intellectual property rights and respond to claims of
          copyright infringement. In case of infringement claims, please email
          us at admin@zena.com.
        </p>

        <h2 className="text-xl font-bold">Contact Information</h2>
        <p className="text-sm text-gray-500">
          For any inquiries or support requests, please contact us at
          support@zeenoPay.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServiceInfo;
