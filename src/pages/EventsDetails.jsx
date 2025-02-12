import React, { useContext, useEffect } from "react";
import EventDetails from "../components/eventsDetails/EventDetails.jsx";
import { EventContext } from "../EventProvider.jsx";

const EventsDetails = () => {
  // const { getAllEvents, events } = useContext(EventContext);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     await getAllEvents();
  //   };
  //   fetchEvents();
  // }, [getAllEvents]);

  // useEffect(() => {
  //   console.log(events);
  // }, [events]); // Logs events whenever they change

  return (
    <>
      <EventDetails />
    </>
  );
};

export default EventsDetails;
