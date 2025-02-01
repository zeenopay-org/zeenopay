import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen((prev) => !prev);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const multitaskHandler = () => {
    handleScrollToTop();
    toggleHamburgerMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-customDarkBlue px-6 flex sticky top-0 justify-between items-center text-[16px] z-50 w-full">
      <div>
        <Link to="/" onClick={handleScrollToTop}>
          <img className="w-[186px] mb-2" src="/assets/image 35.png" alt="Logo" />
        </Link>
      </div>

      {/* Hamburger Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleHamburgerMenu} className="text-white focus:outline-none">
          <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isHamburgerMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-2 justify-center items-center">
        <div className="flex items-center gap-8 text-white font-semibold tracking-tight">
          <Link to="/" onClick={handleScrollToTop}>Home</Link>
          <Link to="/eventList" onClick={handleScrollToTop}>Events</Link>
          <Link to="/registration" onClick={handleScrollToTop}>Registration</Link>
          <Link to="/contact-us" onClick={handleScrollToTop}>Contact Us</Link>
          <Link to="/about-us" onClick={handleScrollToTop}>About Us</Link>

          {/* Dropdown Button - Clickable Text + Image */}
          <div ref={dropdownRef} className="relative">
            <button onClick={toggleDropdown} className="flex items-center">
              Other Services
              <img
                className={`h-[10px] ml-2 filter contrast-150 cursor-pointer transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                src="/assets/drop.png"
                alt="Dropdown Icon"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-customDarkBlue shadow-lg rounded-md text-white transition-all duration-300 origin-top">
                <div className="flex flex-col items-start space-y-2 p-2">
                  {[{ label: "Our Services", path: "/our-services" },
                    { label: "Privacy Policy", path: "/privacy-policy" },
                    { label: "Terms of Services", path: "/terms-of-services" }].map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="p-2 text-sm hover:bg-gray-700 rounded"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate(item.path);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div
        className={`fixed top-[70px] right-0 w-full bg-[rgba(13,23,77,1)] text-white shadow-lg -z-10 transform transition-transform duration-500 ${isHamburgerMenuOpen ? "translate-y-0" : "-translate-y-[120%]"}`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {[{ label: "Home", to: "/" },
            { label: "Events", to: "/eventList" },
            { label: "Registration", to: "/registration" },
            { label: "Contact Us", to: "/contact-us" },
            { label: "About Us", to: "/about-us" },
            { label: "Our Services", to: "/our-services" },
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Services", to: "/terms-of-services" }].map((item, index) => (
              <div key={index}>
              <Link to={item.to} onClick={multitaskHandler}>
                {item.label}
              </Link>
              {index !== 7 && <hr className="border-white opacity-10" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
