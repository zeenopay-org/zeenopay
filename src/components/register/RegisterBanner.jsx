import React, { useState, useEffect, useContext, useCallback } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { FiBookmark } from "react-icons/fi"; 
import { EventContext } from "../../EventProvider";

const SkeletonLoader = React.memo(() => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
    <div className="h-4 bg-gray-700 rounded w-4/6 mx-auto"></div>
  </div>
));

const SkeletonImageLoader = React.memo(() => (
  <div className="animate-pulse h-full w-full bg-gray-700 rounded"></div>
));

function Register({ fields }) {
  const [loading, setLoading] = useState(true);
  const { form } = useContext(EventContext);

  useEffect(() => {
    if (form) {
      setLoading(false);
    }
  }, [form]);

  const formatTime = useCallback((isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    
    // Get UTC time components to avoid timezone conversion
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    // Convert to 12-hour format
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hour12}:${formattedMinutes} ${ampm}`;
  }, []);

  const formatDateTime = useCallback((isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    
    // Get UTC date components to avoid timezone conversion
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    // Format date
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${monthNames[month]} ${day}, ${year}`;
    
    // Format time in 12-hour format
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedTime = `${hour12}:${formattedMinutes} ${ampm}`;
    
    return `${formattedDate}, ${formattedTime}`;
  }, []);

  if (!form && !loading) {
    return <div className="text-white text-center p-8">Event not found!</div>;
  }

  return (
    <div>
      <div className="bg-customBlue p-4 pt-10 w-full flex items-center justify-center">
        <div className="flex bg-customDarkBlue flex-col-reverse md:flex-row w-full max-w-6xl md:mx-auto text-white rounded-lg overflow-hidden shadow-lg">
          
          <div className="p-6 md:p-4 lg:p-8 flex gap-6 flex-col justify-center w-full md:w-2/3">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <>
                {form.title && (
                  <h2 className="lg:text-xl sm:text-s font-bold flex items-center gap-2">
                    <FiBookmark className="text-yellow-400" /> {form.title}
                  </h2>
                )}

                {form.desc && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {form.desc}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {(fields.finaldate || form.finaldate) && (
                    <div className="flex items-center mb-3">
                      <Calendar className="w-5 h-5 mr-2 text-gray-300" />
                      <span>{formatDateTime(fields.finaldate || form.finaldate)}</span>
                    </div>
                  )}

                  {(fields.formDate || form.formDate) && (
                    <div className="flex items-center mb-3">
                      <Calendar className="w-5 h-5 mr-2 text-gray-300" />
                      <span>{fields.formDate || form.formDate}</span>
                    </div>
                  )}

                  {(fields.formDate || form.formDate) && formatTime(fields.formDate || form.formDate) && (
                    <div className="flex items-center mb-3">
                      <Clock className="w-5 h-5 mr-2 text-gray-300" />
                      <span>{formatTime(fields.formDate || form.formDate)}</span>
                    </div>
                  )}

                  {(fields.formLocation || form.formLocation) && (
                    <div className="flex items-center mb-3">
                      <MapPin className="w-5 h-5 mr-2 text-gray-300" />
                      <span>{fields.formLocation || form.formLocation}</span>
                    </div>
                  )}

                  {(fields.formFee || form.formFee) && (
                    <div className="flex items-center">
                      <p className="text-xl">Rs {fields.formFee || form.formFee}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-3/5 min-h-[250px]">
            {loading ? (
              <SkeletonImageLoader />
            ) : (
              form.img && (
                <img
                  src={form.img}
                  alt={form.title}
                  loading="lazy"
                  className="w-full h-auto object-cover md:h-[80%] lg:h-full sm:h-[70%]"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;