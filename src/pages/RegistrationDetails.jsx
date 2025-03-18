import React, { useContext, useEffect, useState } from "react";
import RegisterBanner from "../components/register/RegisterBanner.jsx";
import EventRegistrationForm from "../components/register/RegistrationForm.jsx";
import { EventContext } from "../EventProvider.jsx";
import { useParams } from "react-router-dom";

const RegistrationDetails = () => {
  const { form, getForm } = useContext(EventContext);
  const [fields, setFields] = useState([]);
  console.log("annohbsbius", form);
  

  const { id } = useParams();
  console.log("svblhvbsl", id);
  

  // Fetch form data when `id` changes
  useEffect(() => {
    const fetchForm = async () => {
      try {
        await getForm(id); // Fetch form data
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchForm();
  }, [getForm, id]); // Only depend on `getForm` and `id`

  // Parse `form.fields` when `form` changes
  useEffect(() => {
    if (form?.fields) {
      try {
        const parsedFields = JSON.parse(form.fields);
        setFields(parsedFields); 
      } catch (error) {
        console.error("Error parsing form fields:", error);
      }
    }
  }, [form]);

  return (
    <>
      <RegisterBanner fields={fields}  />
      <EventRegistrationForm fields={fields} formId={id} />
    </>
  );
};

export default RegistrationDetails;