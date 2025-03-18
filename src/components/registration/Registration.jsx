import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { EventContext } from "../../EventProvider";

function Registration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { forms, getAllForms } = useContext(EventContext);

  useEffect(() => {
    getAllForms();
  }, [getAllForms]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleCardClick = (feature) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(`/registration-details/${feature.id}`);
  };

  const SkeletonLoader = () => (
    <div className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0 animate-pulse">
      <div className="h-56 bg-gray-700 rounded-3xl"></div>
      <div className="flex flex-col pl-4 pr-4 flex-grow py-4">
        <div className="h-6 bg-gray-600 rounded-md mb-2"></div>
        <div className="h-4 bg-gray-600 rounded-md mb-2"></div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-4 bg-gray-600 rounded-md w-24"></div>
          <div className="h-8 bg-gray-600 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );

  const formatDate = (isoString) => {
    if (!isoString) return "N/A"; // Check if the date is empty or undefined
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "N/A" 
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <div className="bg-customBlue px-4 min-h-screen p-60 sm:px-8 md:px-16 lg:px-32 py-8 md:py-12 lg:py-16">
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        Registration
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full lg:grid-cols-3 gap-8">
        {/* Render skeleton loader while loading */}
        {loading
          ? Array(3)
              .fill()
              .map((_, index) => (
                <SkeletonLoader key={index} /> // Skeleton placeholders
              ))
          : forms.map((feature, index) => {
              const fields = JSON.parse(feature.fields); // Parse fields JSON string

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(feature)}
                  className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0"
                >
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full p-2 h-60 lg:h-60 md:h-68 rounded-3xl object-cover"
                  />

                  <div className="pl-4 pr-4 flex flex-col flex-grow">
                    <h3 className="text-lg md:text-lg font-semibold">
                      {feature.title}
                    </h3>
                     
                    <div className="flex justify-between items-center mt-auto">
                      <p className="flex items-center text-xs md:text-sm text-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDate(fields.formDate)}
                      </p>
                      <button
                        onClick={() => handleCardClick(feature)}
                        className="bg-[#003A75] hover:bg-[#005190] text-white text-sm md:text-sm px-3 py-[6px] my-4 rounded-full"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Registration;
