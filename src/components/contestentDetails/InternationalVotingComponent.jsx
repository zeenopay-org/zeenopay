import { useState, useRef, useContext } from "react";
import CustomDropdown from "../ReusableInputField/CustomDropdown.jsx";
import { EventContext } from "../../EventProvider.jsx";

const VotingComponent = () => {

  
  // const currencyOptions = [
  //   { value: "USD", label: "USD: United States Dollar", cc: "us" },
  //   { value: "AUD", label: "AUD: Australian Dollar", cc: "au" },
  //   { value: "GBP", label: "GBP: British Pound Sterling", cc: "gb" },
  //   { value: "CAD", label: "CAD: Canadian Dollar", cc: "ca" },
  //   { value: "EUR", label: "EUR: Euro", cc: "eu" },
  //   { value: "AED", label: "AED: UAE Dirham", cc: "ae" },
  //   { value: "QAR", label: "QAR: Qatari Riyal", cc: "qa" },
  //   { value: "MYR", label: "MYR: Malaysian Ringgit", cc: "my" },
  //   { value: "KWD", label: "KWD: Kuwaiti Dinar", cc: "kw" },
  //   { value: "CNY", label: "CNY: Chinese Yuan", cc: "cn" },
  //   { value: "SAR", label: "SAR: Saudi Riyal", cc: "sa" },
  //   { value: "SGD", label: "SGD: Singapore Dollar", cc: "sg" },
  //   { value: "HKD", label: "HKD: Hong Kong Dollar", cc: "hk" },
  //   { value: "NOK", label: "NOK: Norwegian Krone", cc: "no" },
  //   { value: "KRW", label: "KRW: South Korean Won", cc: "kr" },
  //   { value: "JPY", label: "JPY: Japanese Yen", cc: "jp" },
  //   { value: "THB", label: "THB: Thai Baht", cc: "th" },
  //   { value: "INR", label: "INR: Indian Rupees", cc: "in" },
  // ];

  // const currencyValues = {
  //   USD: [25, 50, 75, 125, 150, 200],
  //   GBP: [25, 50, 75, 125, 150, 200],
  //   EUR: [25, 50, 75, 125, 150, 200],
  //   AUD: [30, 60, 100, 150, 200, 300],
  //   CAD: [30, 60, 100, 150, 200, 300],
  //   SGD: [30, 60, 100, 150, 200, 300],
  //   AED: [50, 100, 250, 500, 750, 1000],
  //   QAR: [50, 100, 250, 500, 750, 1000],
  //   CNY: [50, 100, 250, 500, 750, 1000],
  //   SAR: [50, 100, 250, 500, 750, 1000],
  //   MYR: [75, 150, 250, 500, 750, 1000],
  //   KWD: [75, 150, 250, 500, 750, 1000],
  //   HKD: [100, 200, 350, 500, 750, 1000],
  //   NOK: [100, 200, 350, 500, 750, 1000],
  //   KRW: [300, 700, 1500, 2500, 3500, 5000],
  //   JPY: [300, 700, 1500, 2500, 3500, 5000],
  //   THB: [1000, 1500, 2000, 5000, 7500, 10000],
  //   INR: [25, 50, 75, 125, 150, 200],
  // };

  // const votesPerCurrency = {
  //   USD: 10,
  //   AUD: 5,
  //   GBP: 10,
  //   CAD: 5,
  //   EUR: 10,
  //   AED: 2,
  //   QAR: 2,
  //   MYR: 2,
  //   KWD: 2,
  //   HKD: 1,
  //   CNY: 1,
  //   SAR: 2,
  //   OMR: 20,
  //   SGD: 8,
  //   NOK: 1,
  //   KRW: 200,
  //   JPY: 20,
  //   THB: 4,
  //   INR: 10,
  // };


  const currencyOptions = [
    { value: "USD", label: "USD: United States Dollar", cc: "us" },
    { value: "AUD", label: "AUD: Australian Dollar", cc: "au" },
    { value: "GBP", label: "GBP: British Pound Sterling", cc: "gb" },
    { value: "CAD", label: "CAD: Canadian Dollar", cc: "ca" },
    { value: "EUR", label: "EUR: Euro", cc: "eu" },
    { value: "AED", label: "AED: UAE Dirham", cc: "ae" },
    { value: "QAR", label: "QAR: Qatari Riyal", cc: "qa" },
    { value: "MYR", label: "MYR: Malaysian Ringgit", cc: "my" },
    { value: "KWD", label: "KWD: Kuwaiti Dinar", cc: "kw" },
    { value: "CNY", label: "CNY: Chinese Yuan", cc: "cn" },
    { value: "SAR", label: "SAR: Saudi Riyal", cc: "sa" },
    { value: "SGD", label: "SGD: Singapore Dollar", cc: "sg" },
    { value: "HKD", label: "HKD: Hong Kong Dollar", cc: "hk" },
    { value: "NOK", label: "NOK: Norwegian Krone", cc: "no" },
    { value: "KRW", label: "KRW: South Korean Won", cc: "kr" },
    { value: "JPY", label: "JPY: Japanese Yen", cc: "jp" },
    { value: "THB", label: "THB: Thai Baht", cc: "th" },
    { value: "INR", label: "INR: Indian Rupees", cc: "in" },
    // New currencies:
    { value: "KGS", label: "KGS: Kyrgyzstani Som", cc: "kg" },
    { value: "RBL", label: "RBL: [RBL Currency]", cc: "rb" },
    { value: "BDT", label: "BDT: Bangladeshi Taka", cc: "bd" },
    { value: "NZD", label: "NZD: New Zealand Dollar", cc: "nz" },
    { value: "ILS", label: "ILS: Israeli Shekel", cc: "il" },
  ];
  
  const currencyValues = {
    USD: [25, 50, 75, 125, 150, 200],
    GBP: [25, 50, 75, 125, 150, 200],
    EUR: [25, 50, 75, 125, 150, 200],
    AUD: [30, 60, 100, 150, 200, 300],
    CAD: [30, 60, 100, 150, 200, 300],
    SGD: [30, 60, 100, 150, 200, 300],
    AED: [50, 100, 250, 500, 750, 1000],
    QAR: [50, 100, 250, 500, 750, 1000],
    CNY: [50, 100, 250, 500, 750, 1000],
    SAR: [50, 100, 250, 500, 750, 1000],
    MYR: [75, 150, 250, 500, 750, 1000],
    KWD: [75, 150, 250, 500, 750, 1000],
    HKD: [100, 200, 350, 500, 750, 1000],
    NOK: [100, 200, 350, 500, 750, 1000],
    KRW: [300, 700, 1500, 2500, 3500, 5000],
    JPY: [300, 700, 1500, 2500, 3500, 5000],
    THB: [1000, 1500, 2000, 5000, 7500, 10000],
    INR: [25, 50, 75, 125, 150, 200],
    // New currencies:
    KGS: [1000, 4000, 8000, 12000, 16000, 20000],
    RBL: [200, 800, 1600, 3200, 6400, 10000],
    BDT: [1000, 4000, 8000, 12000, 16000, 20000],
    NZD: [50, 100, 250, 500, 750, 1000],
    ILS: [50, 100, 250, 500, 750, 1000],
  };
  
  const votesPerCurrency = {
    USD: 10,
    AUD: 5,
    GBP: 10,
    CAD: 5,
    EUR: 10,
    AED: 2,
    QAR: 2,
    MYR: 2,
    KWD: 2,
    HKD: 1,
    CNY: 1,
    SAR: 2,
    OMR: 20,
    SGD: 8,
    NOK: 1,
    NZD: 4,   // 4 Vote: 1 NZD

    KRW: 200,
    JPY: 20, 
    THB: 4,
    INR: 10,
    RBL: 15,  // 15 RBL: 1 Vote
    BDT: 15,  // 15 BDT: 1 Vote
    KGS: 1,   // 1 Vote: 1 KGS
    ILS: 2,   // 1 Vote: 2 ILS
  };
  

  const { formData, setFormData } = useContext(EventContext);

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [voteOptions, setVoteOptions] = useState([]);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  const [vote, setVote] = useState("");
  const [price, setPrice] = useState("");

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setVoteOptions(currencyValues[currency] || []);
    setHasValue(currencyValues[currency]);

    if (currencyValues[currency]) {
      handleVoteChange(currencyValues[currency][0]);
    }
  };

  const handleVoteChange = (newVotes) => {
    if (!selectedCurrency || !currencyValues[selectedCurrency]) return;
    console.log(newVotes);

    // const minVotes = currencyValues[selectedCurrency][0];
    // const maxVotes = currencyValues[selectedCurrency].slice(-1)[0];

    // newVotes = Math.max(minVotes, Math.min(newVotes, maxVotes));

    const amount = votesPerCurrency[selectedCurrency] * newVotes;

    setFormData((prevData) => ({
      ...prevData,
      votes: ["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
        ? newVotes
        : amount,
      amount: ["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
        ? amount
        : newVotes,
    }));

    setVote(newVotes);
    setPrice(amount);
  };
  const handleInputBlur = () => {
    if (!selectedCurrency) return;

    let userValue;

    if (selectedCurrency === "INR") {
        userValue = Math.max(10, Math.min(15000, vote)); // INR should have min 10 and max 15000
    } else if (currencyValues[selectedCurrency]) {
        const minValue = currencyValues[selectedCurrency][0];
        const maxValue = currencyValues[selectedCurrency].slice(-1)[0];
        userValue = ["KRW", "JPY", "THB", "RBL","BDT","KGS","ILS"].includes(selectedCurrency) ? vote : formData.amount;
        userValue = Math.max(minValue, Math.min(maxValue, userValue)); // Clamp within range
    }

    handleVoteChange(userValue);
};



  const handleButtonClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="p-6 bg-customBlue text-white">
      <div className="flex max-w-[700px] flex-col items-center mt-6">
        {selectedCurrency && (
          <>
            <div className="grid grid-cols-2  md:grid-cols-3 gap-4 mt-4 p-6">
              {voteOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleVoteChange(option)}
                  className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency) ? (
                    <>
                      <img
                        className="h-6 w-10 sm:h-8 sm:w-14"
                        src="https://media.zeenopay.com/VOTE_ICON.PNG"
                        alt="vote icon"
                      />
                      {option}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="100"
                        height="100"
                        fill="white"
                        stroke="white"
                        strokeWidth="2"
                        className="h-6 w-10 sm:h-8 sm:w-14"
                      >
                        <ellipse cx="12" cy="5" rx="8" ry="3" fill="none" />
                        <path
                          d="M4 5v4c0 1.5 3.6 3 8 3s8-1.5 8-3V5"
                          fill="none"
                        />
                        <ellipse cx="12" cy="10" rx="8" ry="3" fill="none" />
                        <path
                          d="M4 10v4c0 1.5 3.6 3 8 3s8-1.5 8-3V10"
                          fill="none"
                        />
                        <ellipse cx="12" cy="15" rx="8" ry="3" fill="none" />
                        <path
                          d="M4 15v4c0 1.5 3.6 3 8 3s8-1.5 8-3v-4"
                          fill="none"
                        />
                      </svg>
                      {selectedCurrency} {option}
                    </>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleButtonClick}
              className="w-12 h-12 mt-4 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl"
            >
              +
            </button>

            <p className="mt-2 mb-4 text-sm text-gray-400">
              Min{" "}
              {selectedCurrency
                ? selectedCurrency === "INR"
                  ? "10"
                  : currencyValues[selectedCurrency][0]
                : ""}{" "}
              {selectedCurrency &&
              ["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
                ? "votes"
                : selectedCurrency}{" "}
              & Max{" "}
              {selectedCurrency
                ? selectedCurrency === "INR"
                  ? 15000
                  : currencyValues[selectedCurrency].slice(-1)[0]
                : 15000}{" "}
              {selectedCurrency &&
              ["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
                ? "votes"
                : selectedCurrency}
              .
              {selectedCurrency &&
              ["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
                ? ` One vote = ${selectedCurrency} ${votesPerCurrency[selectedCurrency]}`
                : selectedCurrency
                  ? ` One ${selectedCurrency} = ${votesPerCurrency[selectedCurrency]} Vote`
                  : "Rs 10.0"}
            </p>
          </>
        )}

        <CustomDropdown
          options={currencyOptions}
          handleOnChangeDropDown={handleCurrencyChange}
          placeholder="Select Currency"
          optionBgColor="bg-customBlue"
          inputBgColor="bg-customBlue"
        />

        <div className="relative flex items-center w-full gap-2 mt-6">
          <button
            onClick={() => {
              handleVoteChange(formData.amount - 1);
              handleButtonClick();
            }}
            className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl hover:bg-gray-700 transition"
          >
            -
          </button>

          <div className="relative flex-grow">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              ref={inputRef}
              className="peer w-full h-12 bg-transparent text-white text-lg outline-none border border-gray-600 rounded-lg px-4 pt-5 pb-1 text-center appearance-none focus:border-blue-500 transition-all duration-300"
              value={
                selectedCurrency === "INR"
        ? Math.max(10, Math.min(15000, vote)) // Ensure within range
        : ["KRW", "JPY", "THB", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)
        ? vote
        : formData.amount
              }
              onChange={(e) => {
                const inputValue = Number(e.target.value) || 0;
                if (selectedCurrency) {
                  let clampedValue = inputValue;

                  if (selectedCurrency === "INR") {
                    clampedValue = Math.max(0, Math.min(15000, inputValue));
                    setVote(clampedValue);
                  } else if (["KRW", "JPY", "THB", "RBL","BDT","KGS","ILS"].includes(selectedCurrency)) {
                    setVote(inputValue);
                  } else {
                    setFormData((prev) => ({ ...prev, amount: inputValue }));
                  }
                }
              }}
              onBlur={handleInputBlur}
              placeholder=""
            />
          </div>
          <button
            onClick={() => {
              handleVoteChange(formData.amount + 1);
              handleButtonClick();
            }}
            className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl hover:bg-gray-700 transition"
          >
            +
          </button>
        </div>

        <p className="mt-4 text-normal text-gray-400">
          {["KRW", "JPY", "THB", "INR", "RBL","BDT","KGS","ILS"].includes(selectedCurrency) ? (
            <div>
              Total amount:{" "}
              <span className="text-blue-400 font-semibold">{price}</span>
            </div>
          ) : (
            <div>
              Total votes:{" "}
              <span className="text-blue-400 font-semibold">
                {formData.votes}
              </span>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default VotingComponent;
