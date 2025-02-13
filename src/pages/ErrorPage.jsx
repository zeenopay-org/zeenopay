import React from 'react'

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-customBlue text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl mt-4">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-white text-customBlue rounded-lg font-semibold">Go Home</a>
      </div>
    </div>
  )
}

export default ErrorPage
