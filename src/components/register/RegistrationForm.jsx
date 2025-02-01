import { useState } from "react";
import { Pencil } from "lucide-react";
import UploadImage from "../../assets/Images/Registration/image.png";

export default function EventRegistrationForm() {
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

  return (
    <div className="flex bg-customBlue justify-center items-center md:min-h-screen">
      <div className="bg-customDarkBlue w-full max-w-4xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white text-lg">Image</span>
            <div className="relative">
              {/* Profile Image */}
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={image }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Edit Button */}
              <label className="absolute bottom-0 right-0 bg-blue-900 p-2 rounded-full cursor-pointer">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="mt-1 p-2 w-full bg-customDarkBlue border border-gray-600 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm md:text-base">Male</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm md:text-base">Female</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="prefer-not"
                  checked={formData.gender === "prefer-not"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm md:text-base">Prefer not to say</span>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleInputChange}
              placeholder="Permanent Address"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div>
            <input
              type="text"
              name="temporaryAddress"
              value={formData.temporaryAddress}
              onChange={handleInputChange}
              placeholder="Temporary Address"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleInputChange}
              placeholder="Guardian's Name"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="+91 Contact Number"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div>
            <input
              type="text"
              name="optionalNumber"
              value={formData.optionalNumber}
              onChange={handleInputChange}
              placeholder="+91 Optional Contact Number"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            />
          </div>

          <div className="col-span-2">
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why do you want to participate in this Event?"
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
              rows="4"
            />
          </div>

          <div className="col-span-2">
            <select
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-600 bg-customDarkBlue rounded-md"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="social-media">Social Media</option>
              <option value="friends">Friends</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
