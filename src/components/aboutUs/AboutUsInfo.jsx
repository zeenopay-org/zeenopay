import React from 'react'

const AboutUsInfo = () => {
  return (
    <div className="bg-customBlue text-white py-12 px-6">
      <div className="max-w-[85%] mx-auto space-y-6">
        <h1 className="text-xl font-bold">About Us - ZeenoPay</h1>
        <p className="text-sm text-gray-500">
          Welcome to <span className="font-bold">ZeenoPay</span>, a premier platform for event voting, ticketing, and registration, owned and managed by{" "}
          <span className="font-bold">Zeeno International Limited, United Kingdom</span>.
        </p>
        <p className="text-sm text-gray-500">
          We are committed to simplifying event management for organizers, making it easier to host successful events while delivering a seamless experience for attendees. ZeenoPay serves a wide range of events, including concerts, conferences, festivals, pageants, and reality shows, allowing audiences to engage by casting votes for their favorite contestants.
        </p>

        <h2 className="text-xl font-bold">Operations and Management</h2>
        <p className="text-gray-500">
          <span className="font-bold">ZeenoPay's operations</span> are efficiently managed through strategic partnerships tailored to each region:
        </p>
        <ul className="list-disc text-sm ml-6 space-y-2 text-gray-500">
          <li>
            <span className="font-bold">North and South America</span> are managed by <span className="font-bold">Zeeshaan International LLC, USA</span>, ensuring smooth operations across both continents.
          </li>
          <li>
            In <span className="font-bold">India</span>, operations are handled by <span className="font-bold">Zeeno International Private Limited</span>, providing streamlined services throughout the country.
          </li>
          <li>
            In <span className="font-bold">Nepal</span>, <span className="font-bold">Zeeno Group Nepal Private Limited</span> oversees event management and operations, offering localized support for Nepali events.
          </li>
          <li>
            For the rest of <span className="font-bold">Asia</span>, including countries like Thailand, Singapore, and Malaysia, operations are managed by{" "}
            <span className="font-bold">Zeeno Group International LLC in Hong Kong</span>, ensuring localized expertise and top-quality service.
          </li>
          <li>
            <span className="font-bold">United Kingdom and the rest of Europe</span> are handled by <span className="font-bold">Zeeno International Limited, UK</span>, supporting event organizers with a regional focus on European markets.
          </li>
        </ul>
        <p className="text-gray-500">
          These regional partnerships allow us to deliver personalized, region-specific solutions while maintaining the global standards of our platform.
        </p>

        <h2 className="text-xl font-bold">Global Reach and Expansion</h2>
        <p className="text-gray-500">
          Currently, ZeenoPay operates in <span className="font-bold">Nepal, India, UAE, UK, Australia, Hong Kong, Singapore, USA, Thailand, and Malaysia</span> directly. We are constantly expanding to offer our streamlined event management platform to even more countries, allowing event organizers worldwide to benefit from our efficient ticketing, registration, and voting solutions.
        </p>

        <h2 className="text-xl font-bold">Flexible Revenue Model</h2>
        <p className="text-gray-500">
          ZeenoPay follows a flexible and transparent revenue-sharing model. Event organizers retain the majority of their earnings, while ZeenoPay charges a small service fee to maintain and improve the platform. This ensures an affordable yet highly effective solution for event organizers, maximizing the value they receive from our services.
        </p>

        <h2 className="text-xl font-bold">Our Commitment to Success</h2>
        <p className="text-gray-500">
          At ZeenoPay, we are committed to providing innovative and user-friendly tools that empower event organizers. Whether it’s ticketing, registration, or voting solutions, our platform is designed to streamline the entire event process, making it easier and more efficient for organizers and participants alike.
        </p>
        <p className="text-gray-500">
          As we grow, we remain dedicated to expanding our services to new regions and continuously improving the experience for both event organizers and attendees.
        </p>
        <p className="text-gray-500">
          Thank you for choosing ZeenoPay. We look forward to partnering with you to ensure your event's success.
        </p>

        <p className="mt-6 border-t border-gray-600 pt-4 text-sm text-gray-500">
          For more information, please contact us at{" "}
          <a href="mailto:admin@zeenopay.com" className="text-[#2b9af3]">
            admin@zeenopay.com
          </a>.
        </p>
      </div>
    </div>
  )
}

export default AboutUsInfo
