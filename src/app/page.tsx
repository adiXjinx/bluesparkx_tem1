import React from "react"

const Homepage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#143e83] px-4 text-white">
      <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
        Welcome to <span className="text-blue-400">BlueSparkx</span>
      </h1>
      <p className="max-w-md text-center text-lg text-gray-300 sm:text-xl">
        A digital forge where indie SaaS dreams come alive. BlueSparkx is the motherbrand crafting
        bold, powerful tools for tomorrow.
      </p>
      <div className="mt-8 text-sm text-gray-500">
        🚧 Under construction — testing ground for future sparks.
      </div>
    </div>
  )
}

export default Homepage
