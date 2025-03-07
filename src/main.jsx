import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import TermsOfServices from "./pages/TermsOfServices.jsx";
import Policy from "./pages/Policy.jsx";
import { EventProvider } from "./EventProvider.jsx";
import EventsDetails from "./pages/EventsDetails.jsx";
import Events from "./pages/Events.jsx";
import Registration from "./components/registration/Registration.jsx";
import RegistrationDetails from "./pages/RegistrationDetails.jsx";
import ContestantDetails from "./pages/ContestantDetails.jsx";
import RegistrationConfirmation from "./components/registration/RegistrationConfirmation.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import QRPaymentSuccess from "./components/success/QRPaymentSuccess.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "terms-of-services",
        element: <TermsOfServices />,
      },
      {
        path: "privacy-policy",
        element: <Policy />,
      },
      {
        path: "events/:id",
        element: <EventsDetails />,
      },
      {
        path: "eventList",
        element: <Events />,
      },
      {
        path: "registration",
        element: <Registration />,
      },
      {
        path: "registration-details/:id",
        element: <RegistrationDetails />,
      },
      {
        path: "contestant-details/:id",
        element: <ContestantDetails />,
      },
      {
        path: "registration/confirmation",
        element: <RegistrationConfirmation />,
      },
      {path: "success",
        element: <QRPaymentSuccess/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventProvider>
      <RouterProvider router={router} />
    </EventProvider>
  </React.StrictMode>
);
