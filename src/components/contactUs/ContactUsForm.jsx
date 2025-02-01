import React from 'react'

const ContactUsForm = () => {
  return (
    <div className="pt-20 bg-customBlue flex items-center justify-center px-4">
    <form className="bg-customBlue max-w-[85%] w-full space-y-6">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          placeholder="Message"
          rows="4"
          className="w-full p-3 bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-customSky text-white rounded-md hover:bg-customBlue focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Send
        </button>
      </div>
    </form>
  </div>
  )
}

export default ContactUsForm;
