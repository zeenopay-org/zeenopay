import { useState, useRef, useEffect, useContext } from "react";
import { FaCaretDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { EventContext } from "../../EventProvider";

const CustomDropdown = ({
  options,
  handleOnChangeDropDown,
  placeholder = "Select an option",
  labelBgColor = "bg-customBlue",
  optionBgColor = "bg-customDarkBlue",
  inputBgColor = "bg-customDarkBlue",
  grid = "grid-cols-1", // Default to 1 column
}) => {
  const { formData, setFormData } = useContext(EventContext);
  const [drop, setDrop] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState(formData.currency || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDrop(false);
        setInputFocused(!!selectedOption);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  const [id, setID] = useState("");
  const handleSelect = (value, id) => {
    handleOnChangeDropDown(value);
    setSelectedOption(value);
    setID(id);
    setFormData((prevData) => ({ ...prevData, currency: value }));
    setDrop(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Floating Label */}
      <label
        className={`absolute left-3 px-2 text-gray-400 text-base pointer-events-none transition-all duration-300 ease-in-out ${labelBgColor} ${
          selectedOption || inputFocused
            ? "top-0 -translate-y-1/2 text-xs text-blue-500 scale-90 px-2"
            : "top-1/2 md:top-[24px] -translate-y-1/2 text-xs pr-20 scale-100"
        }`}
      >
        {placeholder}
      </label>

      <button
        onClick={() => {
          setDrop((prev) => !prev);
          setInputFocused(true);
        }}
        className={`mt-1 p-3 w-full ${inputBgColor} text-white border border-gray-600 rounded-md shadow-lg focus:ring-2 focus:ring-gray-300 hover:border-blue-500 transition-all duration-300 flex justify-between items-center`}
      >
        {selectedOption ? (
          <div className="flex items-center">
            {options.find((opt) => opt.value === selectedOption)?.cc && (
              <img
                src={`https://flagcdn.com/w40/${options.find((opt) => opt.value === selectedOption)?.cc}.png`}
                alt={`${selectedOption} flag`}
                width="24"
                className="mr-2"
              />
            )}
            {options.find((opt) => opt.value === selectedOption)?.label}
          </div>
        ) : (
          <span className="text-transparent">Select an option</span>
        )}

        <FaCaretDown
          className={`ml-2 transition-transform ${drop ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {drop && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute mt-2 w-full ${optionBgColor} border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-auto grid ${grid} gap-2 p-3`}
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                whileHover={{ scale: 1.02 }}
                className={`p-4 bg-customBlue text-white cursor-pointer transition-all rounded-md shadow-md border border-gray-600 ${grid === "grid-cols-1" ? "flex items-start" : "flex flex-col items-center justify-center"}`}
                onClick={() => handleSelect(option.value, option.id)}
              >
                {option?.cc && (
                  <img
                    src={`https://flagcdn.com/w40/${option?.cc?.toLowerCase()}.png`}
                    alt={`${option.cc} flag`}
                    width="32"
                    className="mb-2 mr-2"
                  />
                )}
                <span className="text-sm font-semibold">{option.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;