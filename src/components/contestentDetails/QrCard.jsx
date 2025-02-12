import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";

export default function QrCode({ handleX }) {
  const { id } = useParams();
  const {
    event,
    getContestant,
    paymentCurrency,
    getPaymentCurrency,
    generateDynamicQr,
    generateIntentId,
    paymentUrl,
  } = useContext(EventContext);

  const [formData, setFormData] = useState({
    intentId: 0,
    name: "",
    phone: "",
    email: "",
    votes: 10,
    amount: 100,
  });

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  useEffect(() => {
    getPaymentCurrency();
  }, [getPaymentCurrency]);

  useEffect(() => {
    const fetchContestant = async () => {
      await getContestant(id);
    };
    fetchContestant();
  }, [getContestant, id]);

  const handleVoteChange = (value) => {
    const updatedVotes = Math.max(10, Math.min(15000, value));
    setFormData((prevData) => ({
      ...prevData,
      votes: updatedVotes,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQR = async (e) => {
    e.preventDefault();
    const { name, phone, email, votes } = formData;
    if (!name || !phone || !email || votes < 10) {
      alert("All fields are required, and votes should be at least 10.");
      return;
    }

    const intentID = generateIntentId();
    await generateDynamicQr(intentID, calculatedAmount, name, email, phone);

    if (paymentUrl) {
      setQrCodeUrl(paymentUrl);
      setShowQRModal(true);
    }
  };

  const calculatedAmount = useMemo(
    () => formData.votes * votePrice,
    [formData.votes]
  );

  const voteButtons = useMemo(
    () =>
      voteOptions.map((option) => (
        <button
          key={option}
          className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
          onClick={() => handleVoteChange(option)}
        >
          <FaRupeeSign />
          {option}
        </button>
      )),
    [voteOptions]
  );

  const countryFlag = useMemo(() => {
    if (paymentCurrency?.cc) {
      return (
        <img
          src={`https://flagcdn.com/w40/${paymentCurrency.cc.toLowerCase()}.png`}
          alt="flag"
          width="24"
          className="mr-2"
        />
      );
    }
    return null;
  }, [paymentCurrency]);

  return (
    <div className="absolute z-40 top-[85px] bg-black bg-opacity-50">
      <div className="relative min-h-screen flex flex-col items-center justify-center md:w-[130%] max-w-[130%] bg-[#01245c] text-white p-4">
        <button
          onClick={handleX}
          className="absolute right-[20px] top-[-5px] text-[32px] text-customSky"
        >
          x
        </button>
        <h1 className="text-xl md:text-2xl font-normal">{event.title}</h1>
        <p className="text-gray-200 mt-1">Voting Closed!</p>

        <div className="mt-6 text-center">
          <h2 className="text-lg font-normal">Select Voting Options</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
            {voteButtons}
          </div>
        </div>

        <p className="mt-2 text-gray-400">
          Min 10 votes & Max 15000 votes. One vote = Rs 10.0
        </p>

        <div className="flex max-w-[700px] flex-col items-center">
          <div className="mt-6 w-full flex items-center gap-4">
            <button
              onClick={() => handleVoteChange(formData.votes - 1)}
              className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-lg"
            >
              -
            </button>

            <input
              type="number"
              className="flex-grow h-12 bg-transparent text-center text-white text-lg outline-none border border-gray-400 rounded-lg px-4"
              value={formData.votes}
              onChange={(e) => handleVoteChange(Number(e.target.value))}
              min="10"
              max="15000"
              placeholder="Enter your vote"
            />

            <button
              onClick={() => handleVoteChange(formData.votes + 1)}
              className="w-12 h-12 flex items-center justify-center text-2xl text-white border border-gray-400 rounded-lg"
            >
              +
            </button>
          </div>

          <p className="mt-4 text-normal text-gray-400">
            Total amount:{" "}
            <span className="text-blue-400 font-semibold">
              Rs {calculatedAmount}
            </span>
          </p>

          <div className="mt-6 w-full flex flex-col gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name (Voter)"
              className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
              value={formData.name}
              onChange={handleInputChange}
            />

            <div className="relative flex items-center border border-gray-400 rounded-lg p-3">
              {countryFlag}
              <span className="text-white mr-2">{paymentCurrency?.mc}</span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone (Voter)"
                className="bg-transparent flex-grow outline-none text-white placeholder-gray-400"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email (Voter)"
              className="p-3 bg-transparent border border-gray-400 rounded-lg text-white w-full outline-none placeholder-gray-400"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl"
          onClick={handleQR}
        >
          Get QR
        </button>

        {showQRModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="mx-auto"
                style={{ width: "350px", height: "350px" }}
              />
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowQRModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
