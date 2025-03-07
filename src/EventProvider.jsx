import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // Import WebSocket client

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState([]);
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState([]);
  const [onGoingEvents, setOnGoingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [contestants, setContestants] = useState([]);
  const [contestant, setContestant] = useState([]);
  const [paymentParnter, setPaymentPartner] = useState([]);
  const [paymentCurrency, setPaymentCurrency] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [paymentIframeUrl, setPaymentIframeUrl] = useState(null);
  const [formData, setFormData] = useState({
    intentId: 0,
    name: "",
    phone: "",
    email: "",
    votes: "",
    amount: 0,
    currency: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("Waiting for payment...");
  const [transactionId, setTransactionId] = useState(null);

  // backend URL
  const BACKEND_URL = "https://api.zeenopay.com";
  const generateDynamicQr = useCallback(
    async (intentId, amount, name, email, phone) => {
      setQrLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/payments/qr/dynamic?intent_id=${intentId}&amount=${amount}&name=${name}&email=${email}&phone_no=${phone}&intent=vote&cc=NP`
        );
        const qrUrl = response.data.goto;
        const txid = qrUrl.split("/")[4].split("_")[1].split(".")[0];
        setTransactionId(txid);

        setQrLoading(false);
        return qrUrl;
      } catch (error) {
        console.error("Error generating QR:", error);
        setQrLoading(false);
      }
    },
    []
  );

  const checkPaymentStatus = (txid) => {
    const socket = io("wss://api.zeenopay.com", {
      transports: ["websocket"], 
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket for payment status.");
      socket.emit("check", txid);
    });

    socket.on("status", (data) => {
      console.log("🔄 Payment status update:", data);

      if (!data) return;

      const [state, transactionId] = data.split(":");

      if (transactionId === txid) {
        if (state.toUpperCase() === "SUCCESS") {
          setPaymentStatus(`✅ Payment Successful!`);
        } else if (state.toUpperCase() === "CANCELED") {
          setPaymentStatus(`❌ Payment Canceled`);
        } else if (state.toUpperCase() === "SCANNED") {
          setPaymentStatus(`📲 QR Code Scanned`);
        } else {
          setPaymentStatus(`⏳ Payment Pending...`);
        }

        // Disconnect WebSocket after final state
        if (["SUCCESS", "CANCELED"].includes(state.toUpperCase())) {
          socket.disconnect();
        }
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    // Cleanup function to disconnect WebSocket on unmount
    return () => socket.disconnect();
  };

  // ✅ Automatically check payment status when txid changes
  useEffect(() => {
    if (!transactionId) return; // Wait for txid to be set

    const socket = io("wss://api.zeenopay.com", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket for payment status.");
      socket.emit("check", transactionId);
    });

    socket.on("status", (data) => {
      console.log("🔄 Payment status update:", data);

      if (!data) return;

      const [state, txid] = data.split(":");

      if (txid === transactionId) {
        setPaymentStatus(state.toUpperCase()); // Update state
      }

      if (["SUCCESS", "CANCELED"].includes(state.toUpperCase())) {
        socket.disconnect(); // Stop listening if payment is complete
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, [transactionId]); // Run effect when txid changes

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
      const response = await axios.get(`${BACKEND_URL}/forms/all`);
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get form by id
  const getForm = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/forms/${id}`);
      // console.log("form_id:",id);
      
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
      const eventData = response.data;
      localStorage.setItem("event", JSON.stringify(eventData));

      setEvent(eventData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      const url1 = response.data;
      setPaymentCurrency(url1);
      // Save to localStorage

      localStorage.setItem("paymentCurrency", JSON.stringify(response.data));
      setLoading(false);
      return url1;
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

  const initiatePartnerPayment = useCallback(
    async (intentId, amount, name, email, phone, partner, currency) => {
      try {
        setLoading(true);

        // Construct query parameters dynamically
        let queryParams = `intent_id=${intentId}&amount=${Number(amount)}&name=${name}&email=${email}&phone_no=${phone}&intent=vote`;
        if (currency) {
          queryParams += `&currency=${currency}`;
        }
        console.log(queryParams);

        const response = await axios.get(
          `${BACKEND_URL}/payments/${partner}/pay?${queryParams}`
        );
        const url = response.data.goto;
        setPaymentUrl(url);
        setLoading(false);
        return url;
      } catch (error) {
        console.error("Payment initiation failed:", error);
        setLoading(false);
        return null;
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
  const redirectToFoneAndPrabhuPay=(url)=>{
    if(url){
      window.location.href = `${BACKEND_URL}${url}`;
    }
  }

  const redirectToPaymentPage = (url) => {
    if (url) {
      setPaymentIframeUrl(`${BACKEND_URL}${url}`);
    }
  };

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
        redirectToPaymentPage,
        redirectToFoneAndPrabhuPay,
        checkPaymentStatus,
        transactionStatus,
        redirectToSuccessPage,
        paymentIframeUrl,
        setPaymentIframeUrl,
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
        generateDynamicQr,
        redirectToQrPage,
        qrLoading,
        paymentStatus,
        setTransactionId,
        transactionId,
        formData,
        setFormData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
