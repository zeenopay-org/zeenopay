import { useState, useRef } from "react";

const LocalVotingComponent = ({ formData, setFormData }) => {
  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  const handleVoteChange = (value) => {
    handleButtonClick();
    const updatedVotes = Math.max(10, Math.min(15000, value));
    const calculatedAmount = updatedVotes * votePrice;

    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
      amount: calculatedAmount,
    }));
  };

  const handleChange = (e) => {
    let rawValue = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(rawValue)) return;

    // Convert to number
    let value = Number(rawValue);

    // Enforce max limit immediately
    if (value > 15000) value = 15000;

    setFormData((prev) => ({
      ...prev,
      votes: rawValue === "" ? "" : value, // Allow empty while typing
      amount: value ? value * 10 : 0,
    }));
    setHasValue(!!value);
  };

  const handleBlur = () => {
    let value = Number(formData.votes);
    if (isNaN(value) || value < 10) value = 1;

    setFormData((prev) => ({
      ...prev,
      votes: value,
      amount: value * 10,
    }));
  };

  const handleButtonClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <div className="grid grid-cols-2  md:grid-cols-3 gap-4 mt-4 p-8">
        {voteOptions.map((option) => (
          <button
            key={option}
            className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => handleVoteChange(option)}
          >
            <img className="h-8 w-14" src="/assets/vote-icon.png" alt="" />
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleButtonClick}
        className="w-12 h-12 mt-4 text-2xl text-white border border-gray-600 rounded-2xl"
      >
        +
      </button>

      <p className="mt-2 mb-4 text-sm text-gray-400">
        Min 10 votes & Max 15000 votes. One vote = Rs 10.0
      </p>

      <div className="flex max-w-[700px] flex-col items-center -z-20">
        <div className="relative flex items-center w-full gap-2">
          <button
            onClick={() => {
              const newVotes = Math.max(10, formData.votes - 1);
              setFormData({ votes: newVotes, amount: newVotes * 10 });
              handleVoteChange(newVotes);
              setHasValue(newVotes > 0);
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
              value={formData.votes}
              onChange={handleChange}
              onFocus={() => setHasValue(true)}
              onBlur={handleBlur}
              placeholder=" "
            />

            <label
              className={`absolute left-4 text-gray-400 text-lg pointer-events-none transition-all duration-300 
              ${hasValue || document.activeElement === inputRef.current ? "top-0 -translate-y-1/2 scale-90 text-blue-500 bg-customBlue px-2" : "top-1/2 -translate-y-1/2 text-lg text-gray-400"}`}
            >
              Enter your vote
            </label>
          </div>

          <button
            onClick={() => {
              const newVotes = Math.min(15000, formData.votes + 10);
              setFormData({ votes: newVotes, amount: newVotes * 10 });
              handleVoteChange(newVotes);
              setHasValue(true);
            }}
            className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-600 rounded-2xl hover:bg-gray-700 transition"
          >
            +
          </button>
        </div>

        <p className="mt-4 text-normal text-gray-400">
          Total amount:{" "}
          <span className="text-blue-400 font-semibold border-gray-600">
            Rs {formData.amount}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LocalVotingComponent;
