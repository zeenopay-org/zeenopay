import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../EventProvider";

function PaymentOption({ formData }) {
  const [payment, setPayment] = useState({ method: "" });
  const [loading, setLoading] = useState(false);
  const { getPaymentPartner, paymentParnter } = useContext(EventContext);

  const state = formData;
  const {
    initiatePartnerPayment,
    redirectToPaymentPage,
    paymentUrl,
    generateIntentId,
  } = useContext(EventContext);

  useEffect(() => {
    getPaymentPartner();
  }, []);

  if (paymentParnter.cc === "in" && !paymentParnter.partner.includes("payu")) {
    paymentParnter.partner.push("payu");
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    const { name, phone, email, amount } = state;
    if (!name || !phone || !email || !amount) {
      alert("Name, Phone, Amount, and Email are required.");
      return;
    }
    setLoading(true);
    const intentID = generateIntentId();
    const partner = payment.method;
    await initiatePartnerPayment(intentID, amount, name, email, phone, partner);

    if (paymentUrl) {
      redirectToPaymentPage(paymentUrl);
    }
    setLoading(false);
  };

  const handlePaymentChange = (e) => {
    setPayment({ method: e.target.value });
  };

  return (
    <div className="w-full bg-customBlue">
      <div className="flex justify-center items-center pb-6 px-6">
        <div className="bg-customDarkBlue w-[900px] flex flex-col gap-3 text-gray-400 p-12">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-semibold mb-6">Payment Options:</h1>
          </div>
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
          disabled={loading}
          className="bg-customSky w-[900px] flex justify-center items-center gap-3 text-white py-[12px] rounded-[24px] relative"
        >
          {loading ? <div className="w-5 h-5 border-2 border-customDarkBlue border-t-transparent rounded-full animate-spin"></div> : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default PaymentOption;