import { createContext, useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // Import WebSocket client
import QRCodeStyling from "qr-code-styling";
import { LogIn } from "lucide-react";
// import { Navigate, useNavigate } from "react-router-dom";

// import QRCode from "qrcode.react";

const EventContext = createContext();

const EventProvider = ({ children }) => {
  // const navigate = useNavigate();
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
  const [wsUrl, setWsURL] = useState("");

  const [qrString, setQrString] = useState("");
  //for the paymet with new api
  const [eventId, setEventId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  // const [pollingActive, setPollingActive] = useState(false);

  const BACKEND_URL = "https://api.zeenopay.com";
  const BACKEND_URL2 = "https://auth.zeenopay.com";

  const generateDynamicQr = useCallback(async (intentId, amount, eventID,intent, actionID) => {
    setQrLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL2}/payments/qr/pay/dynamic`,
        {
          intent_id: intentId,
          amount: amount,
          name: "administrator",
          phone_no: "administrator",
          event_id: eventID,
          intent: intent ? intent: "V",
          processor: "QR",
          action_id: actionID,
        }
      );

      // console.log("Full API Response:", response.data);

      let qrUrl = response.data.goto;
      if (!qrUrl) throw new Error("Missing 'goto' field in API response.");

      let transactionID = qrUrl.split("/").pop();
      // console.log("transactionId:", transactionID);

      const response2 = await axios.get(`${BACKEND_URL2}${qrUrl}`);
      const QR = response2.data.qr_string;
      const trace = response2.data.trace; 

      if (!QR) throw new Error("Missing 'qr_string' field in API response.");

      setQrString(QR);
      setQrLoading(false);
      setWsURL(trace); // Save WebSocket URL
      setTransactionId(transactionID);
      checkPaymentStatus(transactionID, trace);

      return { QR, transactionID, trace }; // Return relevant data
    } catch (error) {
      console.error("Error generating QR:", error);
      setQrLoading(false);
    }
  }, []);

  const DynamicQrPolling = useCallback(async (transactionID) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL2}/payments/qr/verify/${transactionID}`,
        {
          // headers: {
          //   'X-Client' : 'zeenoClient/3.0'
          // }
        }
      );

      console.log(`${BACKEND_URL2}/payments/qr/verify/${transactionID}`);
      console.log("Response Data:", response.data);

      setPaymentStatus(response.data.paymentStatus);

      return response.data;
    } catch (error) {
      console.error("Error fetching QR verification:", error);
    }
  }, []);

  // const startPolling = useCallback((transactionId) => {
  //   setPollingActive(true);

  //   const intervalId = setInterval(async () => {
  //     const data = await DynamicQrPolling(transactionId);
  //     const txid = data?.prn;

  //     if (data?.paymentStatus === "success") {

  //       clearInterval(intervalId);
  //       setPollingActive(false);
  //       console.log("Payment successful, stopping polling.");
  //       window.location.href = `/qr-success?txid=${txid}`;
  //     }
  //   }, 1333);

  //   return () => clearInterval(intervalId);
  // }, [DynamicQrPolling]);

  // useEffect(() => {
  //   if (transactionId && !pollingActive) {
  //     startPolling(transactionId);
  //   }
  // }, [transactionId, pollingActive, startPolling]);

  // **************************************************************
  const generateStaticQr = useCallback(async (intentId, amount, eventID) => {
    setQrLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL2}/payments/qr/pay/static`,
        {
          // API call to generate QR payment
          intent_id: intentId,
          amount: amount,
          name: "administrator",
          phone_no: "administrator",
          event_id: eventID,
          intent: "V",
          processor: "NQR",
        }
      );

      let qrUrl = response.data.goto;
      if (!qrUrl) throw new Error("Missing 'goto' field in API response.");

      const response2 = await axios.get(`${BACKEND_URL2}${qrUrl}`);
      const transactionID = response2.data.trace;
      const QR = response2.data.qr_string;
      if (!QR) throw new Error("Missing 'qr_string' field in API response.");

      setQrString(QR);
      setQrLoading(false);

      return { QR, transactionID };
    } catch (error) {
      console.error("Error generating QR:", error);
      setQrLoading(false);
    }
  }, []);

  const checkPaymentStatus = (txid, wsUrl) => {
    if (!wsUrl) {
      console.error("❌ WebSocket URL is missing.");
      return;
    }
  
    const socket = io("wss://sio.zeenopay.com/", {
      transports: ["websocket"],
    });
  
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket for payment status.");
      socket.send(`open:${txid}:${wsUrl}`);
    });
  
    socket.on("status", async (data) => { // ✅ Marked as async
      console.log("🔄 Payment status update:", data);
  
      if (!data) return;
  
      const [state, transactionId] = data.split(":");
      console.log("state: ", state);
  
      if (transactionId === txid) {
        if (state.toUpperCase() === "SUCCESS") {
          try {
            console.log("📡 Verifying payment with backend...");
            const response = await axios.get(
              `${BACKEND_URL2}/payments/qr/verify/${transactionId}`
            );
            console.log("✅ Response Data:", response.data);
            setPaymentStatus("✅ Payment Successful!");
          } catch (error) {
            console.error("❌ Error verifying payment:", error);
          }
        } else if (state.toUpperCase() === "CANCELED") {
          setPaymentStatus("❌ Payment Canceled");
        } else if (state.toUpperCase() === "SCANNED") {
          setPaymentStatus("📲 QR Code Scanned");
        } else {
          setPaymentStatus("⏳ Payment Pending...");
        }
  
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
  
    return () => socket.disconnect();
  };
  

  useEffect(() => {
    if (!transactionId) return;

    const socket = io("wss://api.zeenopay.com", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket for payment status.");
      console.log("abcd ID", transactionId);
      socket.emit("check", transactionId);
    });

    socket.on("status", (data) => {
      console.log("🔄 Payment status update:", data);

      if (!data) return;

      const [state, txid] = data.split(":");

      if (txid === transactionId) {
        setPaymentStatus(state.toUpperCase());
      }

      if (["SUCCESS", "CANCELED"].includes(state.toUpperCase())) {
        socket.disconnect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    return () => socket.disconnect();
  }, [transactionId]);

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

  // for the form submitting
  const submitRegistrationForm = useCallback(
    async (formId, formData, amount) => {
      setIsSubmitting(true); // Start loading
      try {
        const response = await fetch(
          `https://auth.zeenopay.com/events/form/response/${formId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ response: formData }),
          }
        );

        if (!response.ok) throw new Error("Failed to submit form");

        const data = await response.json();
        console.log("✅ Form submitted successfully:", data);
        return data;

        // navigate("/registration/confirmation", {
        //   state: { ...formData, form_id: formId, amount: amount },
        // });
      } catch (error) {
        console.error("❌ Error submitting form:", error);
        alert("An error occurred while submitting the form. Please try again.");
      } finally {
        setIsSubmitting(false); // Stop loading
      }
    },
    []
  );

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
      const response = await axios.get(
        `${BACKEND_URL2}/events/contestants?event_id=${id}`
      );
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
      const response = await axios.get(
        `${BACKEND_URL2}/events/contestants/${id}`
      );
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
    async (
      intentId,
      amount,
      name,
      email,
      phone,
      partner,
      eventId,
      intent,
      currency,
      actionId
    ) => {
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
          action_id: actionId || "",
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

        let url = response.data.goto || response.data.redirect_url || null;

        if (!url) {
          throw new Error("Payment URL is not available in the response.");
        }
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

  const redirectToFoneAndPrabhuPay = (url) => {
    if (url) {
      window.location.href = `${BACKEND_URL2}${url}`;
      console.log(url);
      console.log(`${BACKEND_URL2}${url}`);
    }
  };

  const updateCSP = (allowBlob = true) => {
    let metaCSP = document.querySelector(
      "meta[http-equiv='Content-Security-Policy']"
    );

    if (!metaCSP) {
      metaCSP = document.createElement("meta");
      metaCSP.setAttribute("http-equiv", "Content-Security-Policy");
      document.head.appendChild(metaCSP);
    }

    if (allowBlob) {
      metaCSP.setAttribute(
        "content",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://linchpin.phonepe.com https://mercury.phonepe.com; worker-src 'self' blob:;"
      );
    } else {
      metaCSP.setAttribute(
        "content",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://linchpin.phonepe.com https://mercury.phonepe.com;"
      );
    }
  };

  const redirectToPhonePe = async (tokenUrl, mode = "IFRAME") => {
    if (!tokenUrl || typeof tokenUrl !== "string") {
      console.error("Invalid token URL for redirection.");
      return;
    }

    console.log("Starting PhonePe transaction in", mode, "mode.");

    if (!window.PhonePeCheckout || !window.PhonePeCheckout.transact) {
      console.error("PhonePeCheckout script not loaded yet.");
      return;
    }

    updateCSP(true);

    if (mode === "REDIRECT") {
      console.log("Redirecting to:", tokenUrl);
      window.PhonePeCheckout.transact({ tokenUrl: tokenUrl });
    } else if (mode === "IFRAME") {
      window.PhonePeCheckout.transact({
        tokenUrl: tokenUrl,
        type: "IFRAME",
        callback: (response) => {
          console.log("Transaction Response:", response);

          if (response === "USER_CANCEL") {
            alert("Transaction was canceled by the user.");
          } else if (response === "CONCLUDED") {
            alert("Transaction completed successfully.");
          }
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
        isSubmitting,
        setIsSubmitting,
        submitRegistrationForm,
        
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
