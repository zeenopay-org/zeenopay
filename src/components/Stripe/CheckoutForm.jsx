import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ clientSecret, price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: "" },
        });

        if (error) {
            setErrorMessage(error.message);
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            {/* <PaymentElement  /> */}
            {/* <p className="text-right text-blue-300 font-mono">Total Payable Amount: {price}</p> */}
            {/* <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 shadow-lg"
                disabled={!stripe}
            >
                Submit
            </button> */}
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        </form>
    );
};

export default CheckoutForm;
