import React, { useState, useEffect } from "react";

const AboutUsInfo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const SkeletonLoader = () => (
    <div className="bg-customBlue text-white py-12 px-6">
      <div className="max-w-[85%] mx-auto space-y-6 animate-pulse">
        {Array.from({ length: 11 }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-500 rounded-md ${
              index % 4 === 0 ? "w-1/4" : index % 4 === 1 ? "w-3/4" : "w-5/6"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="bg-customBlue text-white py-12 px-6">
          <div className="max-w-[85%] mx-auto space-y-6 text-justify break-words whitespace-normal">
            <h1 className="text-xl font-bold">About Us - ZeenoPay</h1>
            <p className="text-sm text-gray-500">
              Welcome to <span className="font-bold text-white">ZeenoPay</span>,
              a premier platform for event voting, ticketing, and registration,
              owned and managed by{" "}
              <span className="font-bold text-white">
                Zeeno International Limited, United Kingdom.
              </span>
            </p>
            <p className="text-sm text-gray-500">
              We are committed to simplifying event management for organizers,
              making it easier to host successful events while delivering a
              seamless experience for attendees. ZeenoPay serves a wide range of
              events, including concerts, conferences, festivals, pageants, and
              reality shows. Along with ticketing and registration, we offer
              specialized voting solutions for competitions like beauty pageants
              and reality shows, allowing audiences to engage by casting votes
              for their favorite contestants.
            </p>

            <h2 className="text-xl font-bold">Operations and Management</h2>
            <p className="text-gray-500">
              <span className="font-bold text-white">
                ZeenoPay's operations
              </span>{" "}
              are efficiently managed through strategic partnerships in
              different regions:
            </p>
            <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
              <li>
                <span className="font-bold text-white">
                  North and South America
                </span>{" "}
                are managed by{" "}
                <span className="font-bold text-white">
                  Zeeshaan International LLC, USA
                </span>
                , ensuring smooth operations across both continents.
              </li>
              <li>
                In <span className="font-bold text-white">India</span>,
                operations are handled by{" "}
                <span className="font-bold text-white">
                  Zeeno International Private Limited
                </span>
                , providing streamlined services throughout the country.
              </li>
              <li>
                In <span className="font-bold text-white">Nepal</span>,{" "}
                <span className="font-bold text-white">
                  Zeeno Group Nepal Private Limited
                </span>{" "}
                oversees event management and operations, offering localized
                support for Nepali events.
              </li>
              <li>
                For the rest of{" "}
                <span className="font-bold text-white">Asia</span>, including
                countries like Thailand, Singapore, and Malaysia, operations are
                managed by{" "}
                <span className="font-bold text-white">
                  Zeeno Group International LLC, Hong Kong
                </span>
                , ensuring localized expertise and top-quality service.
              </li>
              <li>
                <span className="font-bold text-white">
                  United Kingdom and the rest of Europe
                </span>{" "}
                are handled by{" "}
                <span className="font-bold text-white">
                  Zeeno International Limited, UK
                </span>
                , supporting event organizers with a regional focus on European
                markets.
              </li>
            </ul>

            <h2 className="text-xl font-bold">Global Reach and Expansion</h2>
            <p className="text-gray-500">
              Currently, ZeenoPay operates in{" "}
              <span className="font-bold text-white">
                Nepal, India, UAE, UK, Australia, Hong Kong, Singapore, USA,
                Thailand, and Malaysia.
              </span>{" "}
              We are continuously expanding to offer our platform to more
              countries.
            </p>

            <h2 className="text-xl font-bold">Flexible Revenue Model</h2>
            <p className="text-gray-500">
              ZeenoPay follows a transparent revenue-sharing model. Event
              organizers retain the majority of their earnings, while ZeenoPay
              charges a small service fee for platform maintenance.
            </p>

            <h2 className="text-xl font-bold">Our Commitment to Success</h2>
            <p className="text-gray-500">
              At ZeenoPay, we are dedicated to providing innovative and
              user-friendly tools for event organizers. Our solutions ensure
              seamless ticketing, registration, and voting experiences.
            </p>
            <p className="text-gray-500">
              We continue to grow and improve, expanding services to new regions
              while maintaining a strong commitment to our users.
            </p>

            <p className="mt-6 border-t border-gray-600 pt-4 text-md font-bold text-white text-gray-500">
              For more information, contact us at{" "}
              <a
                href="mailto:admin@zeenopay.com"
                className="text-[#2b9af3] hover:underline "
              >
                admin@zeenopay.com
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUsInfo;
