import React from "react";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { useParams } from "react-router-dom";
import slugify from "slugify";

// Sample event data
const events = [
  {
    id: 1,
    title: "Live Photography Webinar",
    img: "/assets/regi1.png",
    time: "18, January 2025",
    location: "4517 Washington Ave, Manchester",
    price: "$240",
    eventTime: "06:15 PM Onwards",
  },
  // Add more events as needed
];

function Register() {
  const { slug } = useParams(); // Get slug from URL parameter
  
  // Find event by slug (slugify title to match the URL parameter)
  const event = events.find((event) => slugify(event.title, { lower: true }) === slug);
  
  if (!event) {
    return <div>Event not found!</div>; // Show a message if the event is not found
  }

  return (
    <div className=" bg-customBlue pt-10 w-full flex items-center justify-center">
      {/* Display the event details */}
      <div className="flex bg-customDarkBlue flex-col-reverse md:flex-row   w-full  max-w-4xl  md:mx-auto  text-white rounded-lg overflow-hidden shadow-lg">
        {/* Left Section - Text */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-16 flex gap-6 flex-col justify-center w-full md:w-2/5">
          <h2 className="lg:text-xl sm:text-s font-bold">{event.title}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 mr-2 text-gray-300" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 mr-2 text-gray-300" />
              <span>{event.eventTime}</span>
            </div>

            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 mr-2 text-gray-300" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-300" />
              <p className="text-xl font-semibold">{event.price}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-3/5">
          <img
            src={event.img}
            alt={event.title}
            className="w-full h-auto object-cover md:h-[80%] lg:h-full sm:h-[70%] "
          />
        </div>
      </div>

      {/* Registration Form Section */}
    </div>
  );
}

export default Register;
