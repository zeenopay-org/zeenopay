import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { EventContext } from "../../EventProvider";

function Registration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { forms, getAllForms } = useContext(EventContext);

  useEffect(() => {
    setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    }, 100);
  }, []);

  useEffect(() => {
    getAllForms();
  }, [getAllForms]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleCardClick = (feature) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/registration-details/${feature.id}`);
  };

  const SkeletonLoader = () => (
    <div className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col animate-pulse" style={{ height: "400px" }}>
      <div className="w-full aspect-[4/3] bg-gray-700 rounded-t-3xl"></div>
      <div className="flex flex-col p-4 flex-grow">
        <div className="h-4 bg-gray-500 rounded w-3/5 mb-2"></div>
        <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
        <div className="flex gap-20 mt-auto">
          <div className="h-3 bg-gray-500 rounded w-1/2 mb-1"></div>
          <div className="h-6 bg-gray-500 w-[40%] rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
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
    <div className="bg-customBlue px-4 sm:px-8 md:px-16 lg:px-[148px] pb-12 pt-8">
      <h2 className="text-white text-2xl font-semibold text-center mb-8">
     Ongoing Registration
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <SkeletonLoader key={index} />)
          : forms.map((feature, index) => {
              const fields = JSON.parse(feature.fields);
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(feature)}
                  className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] relative">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      width="400"
                      height="300"
                      className="absolute inset-0 w-full h-full object-cover p-2 rounded-3xl"
                      loading="lazy"
                      style={{ display: "block" }}
                    />
                  </div>

                  <div className="flex flex-col px-4 pt-2 pb-4 flex-grow">
                    <h3 className="text-sm md:text-[12px] font-semibold">{feature.title}</h3>
                    <p className="text-xs md:text-[10px] text-gray-300 mt-1 flex-grow">
                      {/* Optional short description if needed */}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="flex items-center text-xs text-gray-100">
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
                        className="bg-[#003A75] hover:bg-[#005190] text-white text-xs px-3 py-[6px] my-4 rounded-full"
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
