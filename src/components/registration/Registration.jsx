import { useNavigate } from "react-router-dom";
import slugify from "slugify";

const events = [
  {
    id: 1,
    title: "Live Photography Webinar",
    img: "/assets/regi1.png",
    time: "18, January 2025",
  },
];

function Registration() {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    const slug = slugify(title, { lower: true });
    navigate(`/registration-details/${slug}`);
  };

  return (
    <div className="bg-customBlue px-4 min-h-screen p-60 sm:px-8 md:px-16 lg:px-32 py-8 md:py-12 lg:py-16">
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        Registration
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full lg:grid-cols-3 gap-8">
      {events.map((feature, index) => (
          <div
            key={index}
            onClick={()=>{handleCardClick(feature.id)}}
            className="bg-customDarkBlue text-white rounded-3xl shadow-md overflow-hidden flex flex-col flex-shrink-0"
          >
            <img
              src={feature.img}
              alt={feature.heading}
              className="w-full p-2 h-full rounded-3xl"
            />
            <div className="flex flex-col pl-4 pr-4 flex-grow">
              <h3 className="text-lg md:text-[16px] font-semibold">
                {feature.title}
              </h3>
              <p className="text-xs md:text-[10px] text-gray-300 mt-1 flex-grow">
                {feature.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <p className="flex items-center text-xs md:text-xsm text-gray-100">
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
                  {feature.time}
                </p>
                <button 
                       onClick={() => handleCardClick(feature.title)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-sm px-3 py-[6px] my-4 rounded-full">
                  Register
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Registration;
