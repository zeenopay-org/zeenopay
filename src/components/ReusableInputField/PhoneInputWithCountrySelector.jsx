import { useContext, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { EventContext } from "../../EventProvider";

const PhoneInputWithCountrySelector = ({
  countryCodes,
  formData,
  setFormData,
  errors,
  placeholder,
  fieldName,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drop, setDrop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getPaymentCurrency } = useContext(EventContext);

  const handleDrop = () => setDrop((prev) => !prev);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      const parsedCurrency = JSON.parse(savedCurrency);
      setSelectedCountry(parsedCurrency);
      console.log("pC: " + parsedCurrency?.cc);
    } else {
      getPaymentCurrency();
    }
  }, [getPaymentCurrency]);

  return (
    <div>
      <div className="relative flex items-center text-white border border-gray-600 hover:border-blue-500  rounded-md p-1 md:p-0 ">
        {/* Country Selector */}
        <div className="relative">
          <button
            onClick={handleDrop}
            className="flex items-center rounded-lg pr-8 md:p-3  py-2"
          >
            <div className="bold px-2">
              <FaCaretDown />
            </div>
            {selectedCountry?.cc && (
              <img
                src={`https://flagcdn.com/w40/${selectedCountry.cc.toLowerCase()}.png`}
                alt={`${selectedCountry.name} flag`}
                width="24"
                className="mr-2"
              />
            )}
            {selectedCountry?.mc}
          </button>

          {drop && (
            <div className="absolute top-full left-0 w-[300%] bg-customBlue border border-gray-300 rounded-md z-50 shadow-lg">
              {/* Search Input with Icon */}
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search country..."
                  className="w-full pl-10 pr-3 py-2 border-b border-gray-300 text-white bg-customBlue focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Country List */}
              <ul className="max-h-60 overflow-y-auto text-white custom-scrollbar">
                {countryCodes
                  ?.filter(
                    (country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase().trim()) ||
                      country.mc
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase().trim())
                  )
                  .map((country) => (
                    <li
                      key={country.cc}
                      className="flex items-center px-3 py-2 hover:bg-customDarkBlue cursor-pointer "
                      onClick={() => {
                        setSelectedCountry(country);
                        setDrop(false);
                      }}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.cc?.toLowerCase()}.png`}
                        alt={`${country.name} flag`}
                        width="24"
                        className="mr-2"
                      />
                      {country.name} ({country.mc})
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <input
          type="tel" // Ensures the correct keyboard appears on mobile
          inputMode="numeric" // Ensures numeric keyboard on iOS & Android
          pattern="[0-9]*" // Ensures only numbers are allowed
          name={fieldName}
          placeholder={placeholder}
          className="bg-transparent flex-grow outline-none text-white placeholder-gray-400 placeholder:text-sm
  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={formData[fieldName] || ""}
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              [fieldName]: e.target.value,
            }))
          }
        />
      </div>
      {errors[fieldName] && (
        <p className="text-red-400 text-sm">{errors[fieldName]}</p>
      )}
    </div>
  );
};

export default PhoneInputWithCountrySelector;
