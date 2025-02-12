import { createContext, useCallback, useState } from "react";
import axios from "axios";

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState([]);
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState([]);
  const [onGoingEvents, setOnGoingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contestants, setContestants] = useState([]);
  const [contestant, setContestant] = useState([]);
  const [paymentParnter, setPaymentPartner] = useState([]);
  const [paymentCurrency, setPaymentCurrency] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  // backend URL
  const BACKEND_URL = "https://auth.zeenopay.com";

  // to get all the events
  const getAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/events/`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // to get all the forms
  const getAllForms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/events/forms/`);
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  //get form by id
  const getForm = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/forms/${id}`);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get event by id
  const getEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/events/${id}`);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get all ongoing events
  const getAllOngoingEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/events/ongoing`);
      setOnGoingEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get all contestants of an event
  const getAllContestants = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/contestants/${id}`);
      setContestants(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get contestant by id
  const getContestant = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/contestants/c/${id}`);
      setContestant(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Function to generate a random intent_id
  const generateIntentId = () => {
    let part1 = Math.floor(Math.random() * 1e8); // 8 digits

    return Number(`${part1}`);
  };

  //get the payment currency
  const getPaymentCurrency = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/payments/currency`);
      setPaymentCurrency(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  //get payment partner
  const getPaymentPartner = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/payments/partner`);
      setPaymentPartner(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  //Payment logic for By Payment Partner
  const initiatePartnerPayment = useCallback(
    async (intentId, amount, name, email, phone, partner) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/payments/${partner}/pay?intent_id=${intentId}&amount=${Number(amount)}&name=${name}&email=${email}&phone_no=${phone}&intent=vote`
        );
        setPaymentUrl(response.data.goto);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    []
  );

  //Checking payment status
  const checkPartnerPaymentStatus = useCallback(
    async (partner, transactionUuid) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/payments/${partner}/pay/${transactionUuid}`
        );
        setTransactionStatus(response.data.status);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    []
  );

  // generating the dynamic QR
  const generateDynamicQr = useCallback(
    async (intentId, amount, name, email, phone) => {
      intentId = 123456;
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/payments/qr/dynamic?intent_id=${intentId}&amount=${amount}&name=${name}&email=${email}&phone_no=${phone}&intent=vote&cc=NP`
        );
        setPaymentUrl(response.data.goto);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    []
  );

  //redirect qr page
  const redirectToQrPage = (url) => {
    if (url) {
      window.location.href = `${url}`;
    }
  };

  // Payment-related logic for PayU
  // Step 1: Call the API to initiate the payment
  const initiatePayment = useCallback(
    async (intentId, amount, name, email, phone) => {
      intentId = 123456;
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/payments/payu/pay?intent_id=${intentId}&amount=${Number(amount)}&name=${name}&email=${email}&phone_no=${phone}&intent=vote`
        );
        setPaymentUrl(response.data.goto);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    []
  );

  // Step 2: Redirect for payu the user to the PayU payment page
  const redirectToPaymentPage = (url) => {
    if (url) {
      window.location.href = `${BACKEND_URL}${url}`;
    }
  };

  // Step 3: Check payment status for payu
  const checkPaymentStatus = useCallback(async (transactionUuid) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/payments/payu/pay/${transactionUuid}`
      );
      setTransactionStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  // Step 4: Redirect to success page after successful payment
  const redirectToSuccessPage = () => {
    window.location.href = ` ${BACKEND_URL}/payments/payu/success`;
  };

  return (
    <EventContext.Provider
      value={{
        loading,
        getAllEvents,
        events,
        getAllOngoingEvents,
        onGoingEvents,
        getAllContestants,
        contestants,
        getEvent,
        event,
        getContestant,
        contestant,
        initiatePayment,
        redirectToPaymentPage,
        checkPaymentStatus,
        transactionStatus,
        redirectToSuccessPage,
        paymentUrl,
        generateIntentId,
        getAllForms,
        forms,
        getForm,
        form,
        getPaymentCurrency,
        paymentCurrency,
        getPaymentPartner,
        paymentParnter,
        initiatePartnerPayment,
        checkPartnerPaymentStatus,
        generateDynamicQr,
        redirectToQrPage,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
