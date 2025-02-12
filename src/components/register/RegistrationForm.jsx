import { useState, useEffect } from "react";
import { Pencil, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventRegistrationForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    permanentAddress: "",
    temporaryAddress: "",
    guardianName: "",
    contactNumber: "",
    optionalNumber: "",
    email: "",
    reason: "",
    source: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds for demo purposes
    }, 2000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "This field is required";
    if (!formData.gender) errors.gender = "This field is required";
    if (!formData.guardianName.trim())
      errors.guardianName = "This field is required";
    if (!formData.permanentAddress.trim())
      errors.permanentAddress = "This field is required";

    if (!formData.contactNumber.trim())
      errors.contactNumber = "This field is required";
    else if (!/^\+?\d{10,15}$/.test(formData.contactNumber))
      errors.contactNumber = "Invalid contact number";

    if (!formData.optionalNumber.trim())
      errors.optionalNumber = "This field is required";
    if (
      formData.optionalNumber &&
      !/^\+?\d{10,15}$/.test(formData.optionalNumber)
    )
      errors.optionalNumber = "Invalid contact number";
    if (!formData.email.trim()) errors.email = "This field is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      errors.email = "Invalid email format";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      navigate("/registration/confirmation", { state: formData });
    }
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
      {/* Image Skeleton */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
      </div>

      {/* Form Inputs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Textarea Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-24 bg-gray-700 rounded-md"></div>
      </div>

      {/* Select Dropdown Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-10 bg-gray-700 rounded-md"></div>
      </div>

      {/* Save Button Skeleton */}
      <div className="flex justify-center">
        <div className="h-10 bg-gray-700 rounded-2xl w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-customBlue text-center pb-20">
      <div className="pb-10 pt-20">
        <h1 className="font-semibold text-4xl text-white">Registration</h1>
      </div>
      <div className="flex bg-customBlue justify-center items-center p-4  md:min-h-screen">
        <div className="bg-customDarkBlue w-full max-w-6xl p-8 rounded-lg shadow-2xl">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="flex justify-center mb-16">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-white text-lg font-semibold">
                    Image
                  </span>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden flex items-center justify-center bg-gray-700">
                      {image ? (
                        <img
                          src={image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} color="white" />
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 bg-blue-900 p-2 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110">
                      <Pencil size={16} color="white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                    <div className="flex  items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm md:text-base text-white">
                        Male
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm md:text-base text-white">
                        Female
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="prefer-not"
                        checked={formData.gender === "prefer-not"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm md:text-base text-white">
                        Prefer not to say
                      </span>
                    </div>
                  </div>
                  {errors.gender && (
                    <span className="text-red-500 text-sm">
                      {errors.gender}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    placeholder="Permanent Address"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.permanentAddress && (
                    <span className="text-red-500 text-sm">
                      {errors.permanentAddress}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="temporaryAddress"
                    value={formData.temporaryAddress}
                    onChange={handleInputChange}
                    placeholder="Temporary Address"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="Guardian's Name"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.guardianName && (
                    <span className="text-red-500 text-sm">
                      {errors.guardianName}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 Contact Number"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.contactNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.contactNumber}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="optionalNumber"
                    value={formData.optionalNumber}
                    onChange={handleInputChange}
                    placeholder="+91 Optional Contact Number"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.optionalNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.optionalNumber}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  )}
                </div>

                <div>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Why do you want to participate in this Event?"
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                    rows="4"
                  />
                </div>

                {/* Custom Dropdown */}
                <div>
                  <div className="relative">
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="mt-1 p-3 w-full bg-customDarkBlue text-white border border-gray-600 rounded-md shadow-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-500"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="facebook/instagram">
                        Facebook/Instagram
                      </option>
                      <option value="linked/x/twitter">
                        LinkedIn/X/Twitter
                      </option>
                      <option value="tiktok/youtube">TikTok/YouTube</option>
                      <option value="news/advertizement">
                        News/Advertisement
                      </option>
                      <option value="family/friends/relative">
                        Family/Friends/Relative
                      </option>
                      <option value="family/friends/relative">Others</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
