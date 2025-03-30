import React, { useState, useEffect, useContext } from "react";
import { Calendar, Clock, MapPin} from "lucide-react";
import { EventContext } from "../../EventProvider";

function Register({ fields }) {
  const [loading, setLoading] = useState(true);
  const { form} = useContext(EventContext);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 2000);
  }, []);


  const formatTime = (isoString) => {
    if (!isoString) return null; // Return null if empty
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? null // Hide invalid dates
      : date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // Use false for 24-hour format
        });
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6 mx-auto"></div>
    </div>
  );

  const SkeletonImageLoader = () => (
    <div className="animate-pulse h-full w-full bg-gray-700 rounded"></div>
  );

  if (!form && !loading) {
    return <div>Event not found!</div>;
  }

  return (
    <div className="bg-customBlue p-4 pt-10 w-full flex items-center justify-center">
      <div className="flex bg-customDarkBlue flex-col-reverse md:flex-row w-full max-w-6xl md:mx-auto text-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-6 md:p-4 lg:p-8 flex gap-6 flex-col justify-center w-full md:w-2/3">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {form.title && <h2 className="lg:text-xl sm:text-s font-bold">{form.title}</h2>}
              <div className="flex flex-col gap-2">
                {fields.formDate && (
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 mr-2 text-gray-300" />
                    <span>{fields.formDate}</span>
                  </div>
                )}

                {fields.formDate && formatTime(fields.formDate) && (
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 mr-2 text-gray-300" />
                    <span>{formatTime(fields.formDate)}</span>
                  </div>
                )}

                {fields.formLocation && (
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 mr-2 text-gray-300" />
                    <span>{fields.formLocation}</span>
                  </div>
                )}

                {fields.formFee && (
                  <div className="flex items-center">
                    {/* <DollarSign className="w-5 h-5 mr-2 text-gray-300" /> */}
                    <p className="text-xl font-semibold">Rs {fields.formFee}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-3/5">
          {loading ? (
            <SkeletonImageLoader />
          ) : (
            form.img && (
              <img
                src={form.img}
                alt={form.title}
                className="w-full h-auto object-cover md:h-[80%] lg:h-full sm:h-[70%]"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
