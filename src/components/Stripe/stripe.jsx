import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';



const stripePromise = loadStripe("pk_live_51Pz16RBLvFZY0ckIfyDOf1e7TAf1k6VbHErAxGuuoGqfBLWA7YIdWtZLNACS9CUdRMePe6zdFIZmIg5ZFi7NU6h300wlmhXfyu");

export default function Stripe() {
  const options = {
    clientSecret: "pi_3R3jbBBLvFZY0ckI1jPBVkey_secret_ByZRxaQ21Rwp8skWBim2IeBvB",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};
