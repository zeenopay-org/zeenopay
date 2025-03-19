import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // Import WebSocket client
// import QRCode from "qrcode.react";

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

  const [qrString, setQrString] = useState("");
  //for the paymet with new api
  const [eventId, setEventId] = useState("");

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
  const BACKEND_URL2 = "https://auth.zeenopay.com";


  const generateDynamicQr = useCallback(
    async (intentId, amount,intent, name, email, phone,) => {
      setQrLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/payments/qr/dynamic?intent_id=${intentId}&amount=${amount}&intent=${intent || "vote"}&cc=NP`
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

  // **************************************************************
  const generateStaticQr = useCallback(
    async (intentId, amount, name = "9800000001", phone = "9090909090") => {
      setQrLoading(true);
      try {
        const response = await axios.post(
          `${BACKEND_URL2}/payments/qr/pay/static`,
          {
            intent_id: intentId,
            amount: amount,
            name: "9800000001",
            phone_no: "9090909090",
            intent: "V",
          }
        );

        console.log("Full API Response:", response.data);

        let qrUrl = response.data.goto;
        if (!qrUrl) {
          throw new Error("Missing 'goto' field in API response.");
        }

        console.log("Final QRURL:", qrUrl);
        // Set QR string for the image generation
        const QR = response.data.qr_string;
        console.log("QR hbfbd", QR);

        setQrString(QR);

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
      const response = await axios.get(`${BACKEND_URL2}/events/`);
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
      const response = await axios.get(`${BACKEND_URL2}/events/forms`);
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
      const response = await axios.get(`${BACKEND_URL2}/events/forms/${id}`);
      console.log("form_id:", id);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []); // Empty dependency array

  // get event by id
  const getEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL2}/events/${id}`);
      const eventData = response.data;
      localStorage.setItem("event", JSON.stringify(eventData));
      localStorage.setItem("eventId", id);
      setEvent(eventData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
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
      const response = await axios.get(`${BACKEND_URL2}/events/contestants?event_id=${id}`);
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
      const response = await axios.get(`${BACKEND_URL2}/events/contestants/${id}`);
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
    async (intentId, amount, name, email, phone, partner, eventId, intent, currency) => {
      try {
        setLoading(true);
        console.log("This is event ID: " + eventId);
        console.log("This is intent: " + currency);
        const requestBody = {
          intent_id: intentId,
          amount: amount,
          name: name || "98000000001",
          email: email || "admin@gmail.com", 
          phone_no: phone || "9800000001", 
          payment_type: "O", 
          processor: partner.toUpperCase(), 
          intent: intent || "V",
          event_id: eventId,
          status: "P",
          currency: currency, 
        };
        console.log(requestBody);
        console.log("requestBody :", requestBody);
        
        const response = await axios.post(
          `${BACKEND_URL2}/payments/${partner}/pay/`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("responseURL", response.data);

        let url = response.data.goto || response.data.redirect_url || null; 

        if (!url) {
          throw new Error("Payment URL is not available in the response.");
        }
        console.log("Payment URL:", url);
        setPaymentUrl(url);
        setLoading(false);
        return url;
      } catch (error) {
        console.error("Payment initiation failed:", error);
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No Response Received:", error.request);
        } else {
          console.error("Error Details:", error.message);
        }
        setLoading(false);
        return null;
      }
    },
    []
  );

  //redirect qr page
  // const redirectToQrPage = (url) => {
  //   if (url) {
  //     window.location.href = `${BACKEND_URL2}${url}`;
  //   }
  // };
  const redirectToFoneAndPrabhuPay = (url) => {
    if (url) {
      window.location.href = `${BACKEND_URL2}${url}`;
      console.log(url);
      console.log(`${BACKEND_URL2}${url}`);
    }
  };

  const updateCSP = (allowBlob = true) => {
    let metaCSP = document.querySelector("meta[http-equiv='Content-Security-Policy']");
    
    if (!metaCSP) {
      metaCSP = document.createElement("meta");
      metaCSP.setAttribute("http-equiv", "Content-Security-Policy");
      document.head.appendChild(metaCSP);
    }
  
    if (allowBlob) {
      metaCSP.setAttribute("content", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://linchpin.phonepe.com https://mercury.phonepe.com; worker-src 'self' blob:;");
    } else {
      metaCSP.setAttribute("content", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://linchpin.phonepe.com https://mercury.phonepe.com;");
    }
  };
  
  
  const redirectToPhonePe = async (tokenUrl, mode = "IFRAME") => {
    if (!tokenUrl || typeof tokenUrl !== "string") {
      console.error("Invalid token URL for redirection.");
      return;
    }
  
    console.log("Starting PhonePe transaction in", mode, "mode.");
    console.log("Token URL:", tokenUrl);
  
    if (!window.PhonePeCheckout || !window.PhonePeCheckout.transact) {
      console.error("PhonePeCheckout script not loaded yet.");
      return;
    }

    updateCSP(true);

    const fullUrl = `${BACKEND_URL2}${tokenUrl}`;
  
    if (mode === "REDIRECT") {
      console.log("Redirecting to:", fullUrl);
      window.PhonePeCheckout.transact({ tokenUrl: fullUrl });
    } else if (mode === "IFRAME") {
      window.PhonePeCheckout.transact({
        tokenUrl: setPaymentIframeUrl(fullUrl),
        type: "IFRAME",
        callback: (response) => {
          console.log("Transaction Response:", response);
          
          if (response === "USER_CANCEL") {
            alert("Transaction was canceled by the user.");
          } else if (response === "CONCLUDED") {
            alert("Transaction completed successfully.");
          }
  
          // 🔹 Restore Original CSP After Transaction
          updateCSP(false);
        },
      });
    } else {
      console.error("Invalid mode. Choose 'REDIRECT' or 'IFRAME'.");
    }
  };
  
  
  

  const redirectToPaymentPage = (url) => {
    if (url) {
      setPaymentIframeUrl(`${BACKEND_URL2}${url}`);
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
        redirectToPhonePe,
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
        generateStaticQr,
        // redirectToQrPage,
        qrLoading,
        paymentStatus,
        setTransactionId,
        transactionId,
        formData,
        setFormData,
        eventId,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
