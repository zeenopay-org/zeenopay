import React, { useContext, useEffect, useState } from "react";
import RegisterBanner from "../components/register/RegisterBanner.jsx";
import EventRegistrationForm from "../components/register/RegistrationForm.jsx";
import { EventContext } from "../EventProvider.jsx";
import { useParams } from "react-router-dom";

const RegistrationDetails = () => {
  const { form, getForm } = useContext(EventContext);
  const [fields, setFields] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const fetchForm = async () => {
      try {
        await getForm(id);

        if (form?.fields) {
          const field = JSON.parse(form.fields);
          setFields(field);
        }
      } catch (error) {
        console.error("Error parsing form data:", error);
      }
    };
    fetchForm();
  }, [getForm, id, form]);

  return (
    <>
      <RegisterBanner fields={fields} />
      <EventRegistrationForm fields={fields} />
    </>
  );
};

export default RegistrationDetails;
