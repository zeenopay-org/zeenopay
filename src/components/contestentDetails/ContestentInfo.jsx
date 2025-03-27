import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useLocation, useParams } from "react-router-dom";
import { EventContext } from "../../EventProvider";
import PaymentOption from "./PaymentOption";
import QrCard from "./QrCard.jsx";
import countryCodes from "./countryCodes";
import nepalPartner from "./nepalPartner";
import { motion } from "framer-motion";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import CustomDropdown from "../ReusableInputField/CustomDropdown.jsx";
import InternationalVotingComponents from "./InternationalVotingComponent.jsx";
import LocalVotingComponent from "./LocalVotingComponent.jsx";
import PhoneInputWithCountrySelector from "../ReusableInputField/PhoneInputWithCountrySelector.jsx";
import CloudMessage from "./CloudMessage.jsx";
import ConfirmCancelPopup from "../confirmCanclePupup/ConfirmCancelPopup.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import VotingCard from "../VoteCard/voteCard.jsx";

const SkeletonLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-customBlue text-white p-4">
    <div className="flex justify-center items-center w-full relative animate-pulse">
      <div className="w-full max-w-[90%] h-[500px] bg-gray-500 rounded-2xl mb-6"></div>
      <div className="absolute justify-center md:top-[410px] top-[180px] left-[10%] sm:left-[10%]">
        <div className="w-36 h-44 sm:w-[252px] sm:h-[322px] bg-gray-500 rounded-[24px] mx-auto animate-pulse"></div>
      </div>
    </div>
    <div className="mt-60 flex flex-col items-center justify-center">
      <div className="h-6 w-1/3 bg-gray-500 rounded-full mb-4"></div>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-500 w-20 h-12 rounded-lg animate-pulse"
            ></div>
          ))}
      </div>
      <div className="h-4 w-2/3 bg-gray-500 rounded-full mt-4"></div>
      <div className="mt-6 w-full max-w-md bg-[#121c3d] border border-gray-600 p-4 rounded-lg flex items-center justify-between animate-pulse">
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
        <div className="w-32 h-6 bg-gray-500 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function VotingComponent() {
  const { id } = useParams();
  const {
    event,
    getEvent,
    getContestant,
    loading,
    paymentIframeUrl,
    paymentCurrency,
    getPaymentCurrency,
    initiatePartnerPayment,
    redirectToPaymentPage,
    redirectToFoneAndPrabhuPay,
    redirectToPhonePe,
    getPaymentPartner,
    paymentParnter,
    formData,
    setFormData,
    contestant,
  } = useContext(EventContext);

  const [inputFocused, setInputFocused] = useState(false);
  const [pop, setpop] = useState(false);
  const [generateQR, setGenerateQr] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const { passingId } = location.state || {};
  const [temp, setTemp] = useState(null);
  const [finalDate, setFinalDate] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {}, [formData]);

  useEffect(() => {
    getPaymentPartner();
  }, []);

  useEffect(() => {
    const savedEvent = localStorage.getItem("event");

    if (savedEvent) {
      const parsedEvent = JSON.parse(savedEvent);
      setTemp(parsedEvent);
      setFinalDate(parsedEvent.finaldate);
    } else {
      getEvent(passingId);
    }
  }, [passingId, getEvent]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("paymentCurrency");
    if (savedCurrency) {
      const parsedCurrency = JSON.parse(savedCurrency);
      setSelectedCountry(parsedCurrency);
    } else {
      getPaymentCurrency();
    }
  }, [getPaymentCurrency]);

  useEffect(() => {
    const fetchContestant = async () => {
      await getContestant(id);
    };
    fetchContestant();
  }, [getContestant, id]);
  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to initiate payment
  const handleProceedToPay = async (e) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (validateForm()) {
    }
    const { name, phone, email, amount, currency } = formData;
    const isNepal = paymentParnter?.cc === "np";
    const isIndia = paymentParnter?.cc === "in";
    const intent = "V";

    if (!name || !phone || !amount || (!(isNepal || isIndia) && !email)) {
      alert("Name, Phone, and Amount are required. Email is required.");
      return;
    }
    const method = currency === "INR" ? "payu" : "stripe";
    try {
      const eventId = contestant.event;
      const intentId = id;
      const paymentUrl = await initiatePartnerPayment(
        intentId,
        amount,
        name,
        isNepal || isIndia ? "" : email,
        phone,
        method,
        eventId,
        intent,
        currency
      );
      if (method == "stripe") {
        console.log("Redirecting to stripe...");
        redirectToFoneAndPrabhuPay(paymentUrl);
      } else {
        redirectToPaymentPage(paymentUrl);
        console.log("Redirecting to ...");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
    }
  };
  if (loading && !pop && !generateQR) {
    return <SkeletonLoader />;
  }

  const handleQrClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    requestAnimationFrame(() => {
      setGenerateQr(() => !generateQR);
    });
  };

  const handleVoteCard = () => {
    setShowCard(true);
  };
  const closeCard = () => {
    setShowCard(false);
  };
  const handlePartnerChange = (value) => {
    setSelectedPartner(value);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required.";
    const countryCode = selectedCountry?.cc
      ? selectedCountry.cc.toUpperCase()
      : null;
    if (formData.phone?.trim() && countryCode) {
      const phoneNumber = parsePhoneNumberFromString(
        formData.phone,
        countryCode
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        newErrors.phone = "Enter a valid phone number for your country.";
      } else if (phoneNumber.metadata?.country?.[countryCode]) {
        const nationalNumber = phoneNumber.nationalNumber;
        const minLength =
          phoneNumber.metadata.country[countryCode]?.minLength || 0;
        const maxLength =
          phoneNumber.metadata.country[countryCode]?.maxLength || 15;

        if (
          nationalNumber.length < minLength ||
          nationalNumber.length > maxLength
        ) {
          newErrors.phone = `Phone number must be between ${minLength} and ${maxLength} digits.`;
        }
      }
    } else {
      newErrors.phone = "Phone number is required.";
    }

    if (countryCode !== "NP" && countryCode !== "IN") {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 

  const handlePayment = async (e) => {
    e.preventDefault();
    const eventId = contestant.event;
    const isValid = validateForm();
    if (!isValid) {
      console.log("Form validation failed. Payment not initiated.");
      return;
    }

    const { name, phone, email, amount, currency } = formData;
    const isIndia = paymentCurrency?.cc === "in";
    try {
      const partner = "phonepe";
      const intentID = contestant.id;
      const paymentUrl = await initiatePartnerPayment(
        intentID,
        amount,
        name,
        isIndia ? "" : email,
        phone,
        partner,
        eventId,
        currency
      );

      if (paymentUrl) {
        redirectToPhonePe(paymentUrl);
      } else {
        console.log("Payment URL is not available");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const handleNepalPayment = async (e) => {
    e.preventDefault();
    if (!selectedPartner) {
      console.error("No payment partner selected.");
      return;
    }

    const eventId = contestant?.event;
    const intentID = contestant?.id;
    const isValid = validateForm();

    if (!isValid) {
      console.log("Form validation failed. Payment not initiated.");
      return;
    }

    const { name, phone, email, amount } = formData;
    const isNepal = paymentCurrency?.cc === "np";

    let intent;
    try {
      const paymentUrl = await initiatePartnerPayment(
        intentID,
        amount,
        name,
        isNepal ? "" : email,
        phone,
        selectedPartner,
        eventId,
        intent ? "" : "V"
      );

      if (paymentUrl) {
        console.log("selected Partner ", selectedPartner);

        if (
          selectedPartner === "fonepay" ||
          selectedPartner === "prabhupay" ||
          selectedPartner === "esewa"
        ) {
          console.log("Redirecting to Fonepay or PrabhuPay...");
          redirectToFoneAndPrabhuPay(paymentUrl);
        } else {
          redirectToPaymentPage(paymentUrl);
          console.log("Redirecting to ...");
        }
      } else {
        console.log("Payment URL is not available");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const eventFinalDate = new Date(event.finaldate);
  const currentDate = new Date();

  return (
    <div className="  min-h-screen flex flex-col items-center justify-center bg-customBlue text-white p-4 pt-[30px] pb-[66px]">
      {generateQR && <QrCard handleX={handleQrClick} qrid={contestant.id} />}
      <div
        className={`w-full ${generateQR ? "blur-md pointer-events-none" : ""}`}
      >
        {pop ? (
          <PaymentOption formData={formData} />
        ) : (
          <>
            {/* *****************************profile Card**************** */}
            <div>
              <div className="relative flex flex-col justify-center items-center w-full">
                <img
                  src={temp?.img}
                  className="md:w-[1300px] h-[250px] md:h-[400px] rounded-2xl mb-6"
                  alt="Event Banner"
                />

                <div>
                  <div
                    className="absolute bottom-[-130px] left-1/2 transform -translate-x-1/2
  md:bottom-[-100px] md:left-20 md:translate-x-0
  lg:bottom-[-150px] lg:left-20 lg:translate-x-0"
                  >
                    {contestant.shareable_link ? (
                      <div className="relative top-16 md:top-20 left-14 md:left-20 z-50">
                        <CloudMessage />
                      </div>
                    ) : null}
                    <ProfileCard />
                    {selectedCountry?.cc === "np" && (
                      // <>
                        <button
                          onClick={handleQrClick}
                          className="w-56 md:w-64 px-10 mt-6 ml-2 py-3 border border-white text-white text-xs md:text-md rounded-lg hover:bg-white hover:text-[#0A1128] transition duration-300"
                        >
                          Generate QR to Vote
                        </button>
                      //   <button
                      //     onClick={handleVoteCard}
                      //     className="w-56 md:w-64 px-10 mt-6 ml-2 py-3 border border-white text-white text-xs md:text-md rounded-lg hover:bg-white hover:text-[#0A1128] transition duration-300"
                      //   >
                      //     Show Vote Card
                      //   </button>
                      // </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {showCard && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-white p-6 rounded-lg shadow-lg">
                  <VotingCard contestant={contestant} event={event} onClose={closeCard} />
                </div>
              </div>
            )}

            <div className="mt-52 md:mt-32 flex flex-col items-center justify-center">
              <h1 className="text-xl md:text-2xl font-normal">{event.title}</h1>
              <p className="text-white mt- text-center text-sm md:text-lg">
                {loading ? (
                  <div className="h-4 w-1/4 bg-gray-300 animate-pulse"></div>
                ) : currentDate > eventFinalDate ? (
                  "Voting Close!"
                ) : (
                  <>
                    <div className="relative z-0">
                      <CountdownTimer endTime={finalDate} />
                    </div>
                    <h1 className="relative z-10">Voting Open</h1>
                  </>
                )}
              </p>

              {/* Voting Options */}
              <div className="mt-6 text-center">
                <h2 className="text-lg font-normal">Select Voting Options</h2>
                {selectedCountry?.cc === "in" ||
                selectedCountry?.cc === "np" ? (
                  <LocalVotingComponent
                    formData={formData}
                    setFormData={setFormData}
                  />
                ) : (
                  <InternationalVotingComponents />
                )}

                {/* Name, Phone & Email Input */}
                <div className="mt-6 w-full flex flex-col gap-6">
                  {/* ************************************ Input Name *********************************** */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="peer p-3 bg-transparent border border-gray-600 rounded-lg text-white w-full outline-none placeholder-transparent focus:border-blue-500 transition-all duration-300"
                      placeholder="Name (Voter)"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                    />
                    {/* Floating Label */}
                    <label
                      htmlFor="name"
                      className={`absolute left-3 bg-customBlue px-2 text-gray-400 text-base pointer-events-none transform transition-all duration-300 ease-in-out
        ${
          formData.name || inputFocused
            ? "top-0 -translate-y-1/2 scale-90 text-blue-500 px-2"
            : "top-1/2 -translate-y-1/2 scale-100"
        }`}
                    >
                      Name (Voter)
                    </label>
                    {errors.name && (
                      <p className="text-red-400 text-sm">{errors.name}</p>
                    )}
                  </div>
                  {/* ********************************* Input Phone Number Search ************************************** */}

                  <PhoneInputWithCountrySelector
                    countryCodes={countryCodes}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    placeholder="Phone"
                    fieldName="phone"
                  />

                  {selectedCountry?.cc !== "np" &&
                    selectedCountry?.cc !== "in" && (
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email (Voter)"
                          className="p-3 bg-transparent border border-gray-600 rounded-lg text-white w-full outline-none placeholder-gray-400"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm">{errors.email}</p>
                        )}
                      </div>
                    )}

                  {/* ******for Nepal Payment Selector********* */}

                  {selectedCountry?.cc === "np" && (
                    <>
                      {/* Partner Dropdown */}
                      <div className=" w-full max-w-[700px]">
                        <CustomDropdown
                          options={
                            nepalPartner?.[0]?.partner?.map((partner) => ({
                              value: partner.name,
                              id: partner.id,
                              label: (
                                <div className="flex items-center justify-center">
                                  <img
                                    src={partner.image}
                                    alt={`${partner.name}`}
                                    width="96"
                                    className="mr-2"
                                  />
                                </div>
                              ),
                            })) || []
                          }
                          formData={{ source: selectedPartner }}
                          handleOnChangeDropDown={handlePartnerChange}
                          placeholder="Select Payment Partner"
                          labelBgColor="bg-customBlue"
                          optionBgColor="bg-customBlue"
                          inputBgColor="bg-customBlue"
                          grid="grid-cols-2"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* ************************** Terms & Conditions ************************** */}
                <div className="mt-4 bg-customDarkBlue p-2 rounded-lg flex items-center gap-2 text-gray-400 text-xs my-2">
                  <input
                    type="checkbox"
                    id="terms"
                    defaultChecked
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="terms">
                    Noted: I hereby accept the{" "}
                    <span className="text-blue-400">Terms of Service</span> and
                    accept that payments done for voting are non-refundable.
                  </label>
                </div>
              </div>

              {/* ********** Custom Proceed to pay Button ************** */}
              <div>
                {selectedCountry?.cc === "in" ? (
                  <button
                    className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl"
                    onClick={handlePayment}
                  >
                    Proceed to Pay
                  </button>
                ) : selectedCountry?.cc === "np" ? (
                  <button
                    className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl"
                    onClick={handleNepalPayment}
                  >
                    Proceed to Pay
                  </button>
                ) : (
                  <button
                    className="mt-6 bg-white hover:bg-gray-300 text-sm text-purple-800 px-6 py-3 rounded-2xl"
                    onClick={handleProceedToPay}
                  >
                    Proceed to Pay
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {paymentIframeUrl && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[80%] md:w-[60%] lg:w-[40%] h-[70%] bg-customBlue rounded-2xl overflow-hidden relative flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header with Close Button */}
            <div className="bg-customBlue p-4 flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Payment</h2>
              <button
                onClick={() => setShowConfirm(true)}
                className="text-white text-xl hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Iframe */}
            <iframe
              src={paymentIframeUrl}
              className="w-full flex-grow"
              allow="fullscreen"
              allowFullScreen
              style={{
                WebkitOverflowScrolling: "touch",
                overflowY: "auto",
                touchAction: "manipulation",
              }}
            ></iframe>
          </motion.div>

          {/* Confirmation Popup */}
          {showConfirm && (
            <ConfirmCancelPopup
              onClose={() => setShowConfirm(false)}
              onConfirm={() => window.location.reload()}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
