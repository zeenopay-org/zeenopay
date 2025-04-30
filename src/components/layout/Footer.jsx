import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-customDarkBlue px-4 sm:px-8 md:px-16 lg:px-32 py-6 text-[#eae7ef] text-sm">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Logo + Info */}
        <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto">
          <div className="relative w-[186px] h-[60px] mb-2">
            <img
              src="/assets/image 35.png"
              alt="Logo"
              className="w-full h-full object-contain"
              width={186}
              height={60}
              loading="lazy"
            />
          </div>
          <p className="text-center md:text-left">
            Copyright&copy; 2024 ZeenoPay.
          </p>
          <p className="text-gray-600 text-[10px] md:text-[12px] text-center md:text-left">
            All rights reserved
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto">
          <Link to="#" className="text-center md:text-left">
            Get in touch
          </Link>
          <Link to="#" className="text-center md:text-left">
            support@zeenopay.com
          </Link>
        </div>

        {/* Policies */}
        <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto">
          <Link to="#" className="text-center md:text-left">
            Privacy Policy
          </Link>
          <Link to="#" className="text-center md:text-left">
            Cookies Policy
          </Link>
          <Link to="#" className="text-center md:text-left">
            Terms of Use
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
