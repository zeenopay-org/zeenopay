import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { GiMoneyStack } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";

export default function VotingComponent() {
  const [amount, setAmount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [contestant, setContestant] = useState(null);
  const { id } = useParams();
  const { event, getContestant } = useContext(EventContext);

  useEffect(() => {
    async function fetchContestant() {
      const data = await getContestant(id);
      setContestant(data);
    }
    fetchContestant();
  }, [getContestant, id]);

  const [votes, setVotes] = useState(0);
  const votePrice = 10;
  const voteOptions = [25, 50, 100, 500, 1000, 2500];

  const handleVoteChange = (value) => {
    setVotes(Math.max(10, Math.min(15000, value))); // Min 10, Max 15000
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-customBlue text-white p-4">
      <div className="flex justify-center items-center w-full relative">
        <img
          src={event.img}
          className="w-full max-w-[90%] h-auto md:h-[500px] rounded-2xl mb-6"
          alt="Event Banner"
        />
        <div className="absolute justify-center md:top-[410px] top-[180px] left-[10%] sm:left-[10%]">
          <ProfileCard />
        </div>
      </div>
      <div className="mt-60 flex flex-col items-center justify-center">
        <h1 className="text-xl  md:text-2xl font-semibold">{event.title}</h1>
        <p className="text-gray-400 mt-1">Voting Closed!</p>

        {/* Voting Options */}
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold">Select Voting Options</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
            {voteOptions.map((option) => (
              <button
                key={option}
                className="bg-customSky hover:bg-[#0081C6] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                onClick={() => handleVoteChange(option)}
              >
                <FaRupeeSign />
                {option}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2 text-gray-400">
          Min 10 votes & Max 15000 votes. One vote = Rs 10.0
        </p>
        {/* Custom Vote Input */}
        <div className="mt-6 w-full max-w-md bg-[#121c3d] border border-gray-600 p-4 rounded-lg flex items-center justify-between">
          <button
            onClick={() => handleVoteChange(votes - 1)}
            className="text-2xl text-gray-300 px-4"
          >
            -
          </button>
          <input
            type="number"
            className="bg-transparent text-center text-white text-lg outline-none w-full"
            value={votes}
            onChange={(e) => handleVoteChange(Number(e.target.value))}
            min="10"
            max="15000"
          />
          <button
            onClick={() => handleVoteChange(votes + 1)}
            className="text-2xl text-gray-300 px-4"
          >
            +
          </button>
        </div>

        {/* Amount Section */}
        <p className="mt-4 text-lg">
          Total amount:{" "}
          <span className="text-blue-400 font-semibold">
            Rs {votes * votePrice}
          </span>
        </p>

        {/* Name & Phone Input */}
        <div className="mt-6 w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name (Voter)"
            className="p-3 bg-[#121c3d] rounded-lg border border-gray-600  text-white w-full outline-none"
          />
          <input
            type="tel"
            placeholder="Phone (Voter)"
            className="p-3 bg-[#121c3d] rounded-lg border border-gray-600  text-white w-full outline-none"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs">
          <input type="checkbox" id="terms" className="w-4 h-4 text-blue-600" />
          <label htmlFor="terms">
            Noted:I hereby accept the{" "}
            <span className="text-blue-400">Terms of Service</span> and accept
            that payments done for voting are non-refundable.
          </label>
        </div>

        {/* Proceed to Pay */}
        <button className="mt-6 bg-gray-600 hover:bg-gray-300 text-sm text-white px-6 py-3 rounded-2xl w-[30%] max-w-md">
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}
