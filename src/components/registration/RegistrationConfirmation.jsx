import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EventContext } from "../../EventProvider";

function RegistrationConfirmation() {
  const { state } = useLocation();
  const [payment, setPayment] = useState({ method: "" });

  const {
    paymentParnter,
    getPaymentPartner,
    initiatePartnerPayment,
    redirectToPaymentPage,
    paymentUrl,
    generateIntentId,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentPartner();
  }, [getPaymentPartner]);

  // Handle form submission to initiate payment
  const handlePayment = async (e) => {
    e.preventDefault();
    const { name, contactNumber, email } = state;
    if (!name || !contactNumber || !email) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }
    const intentID = generateIntentId();
    const partner = payment.method;
    const amount = 3999;
    await initiatePartnerPayment(
      intentID,
      amount,
      name,
      email,
      contactNumber,
      partner
    );

    if (paymentUrl) {
      redirectToPaymentPage(paymentUrl);
    }
  };

  const handlePaymentChange = (e) => {
    setPayment({ method: e.target.value });
  };

  return (
    <div className=" w-full bg-customBlue ">
      <div className="flex justify-center items-center  pt-11 pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3  text-gray-400 p-12 ">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Filled Informations</h1>
          </div>
          <p>
            <strong>Name: </strong> {state?.name || "N/A"}
          </p>
          <p>
            <strong>Gender: </strong> {state?.gender || "N/A"}
          </p>
          <p>
            <strong>Permanent Address:</strong>{" "}
            {state?.permanentAddress || "N/A"}
          </p>
          <p>
            <strong>Temporary Address:</strong>{" "}
            {state?.temporaryAddress || "N/A"}
          </p>
          <p>
            <strong>Guardian's Name:</strong> {state?.guardianName || "N/A"}
          </p>
          <p>
            <strong>Contact Number:</strong> {state?.contactNumber || "N/A"}
          </p>
          <p>
            <strong>Optional Contact Number:</strong>{" "}
            {state?.optionalNumber || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {state?.email || "N/A"}
          </p>
          <p>
            <strong>Why do you want to participate?</strong>{" "}
            {state?.reason || "N/A"}
          </p>
          <p>
            <strong>How did you hear about this event?</strong>{" "}
            {state?.source || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3 text-gray-400 p-12">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Payment Options:</h1>
          </div>
          {/* Payment Options */}
          <div className="flex flex-col gap-3">
            {paymentParnter?.partner?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  payment.method === option
                    ? "bg-blue-800 text-white shadow-lg"
                    : "bg-transparent hover:bg-blue-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option}
                  checked={payment.method === option}
                  onChange={handlePaymentChange}
                  className="hidden"
                />
                <div
                  className={`w-[17px] h-[17px] flex items-center justify-center border-2 rounded-full transition-all ${
                    payment.method === option
                      ? "border-gray-400 border-4 hover:bg-blue-900"
                      : "border-gray-400"
                  }`}
                >
                  {payment.method === option && (
                    <div className="w-[10px] h-[10px] bg-gray-400 rounded-full"></div>
                  )}
                </div>
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pb-11 px-6">
        <button
          onClick={handlePayment}
          className="bg-customSky w-[900px] flex justify-center items-center gap-3  text-white py-[12px] rounded-[24px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default RegistrationConfirmation;
