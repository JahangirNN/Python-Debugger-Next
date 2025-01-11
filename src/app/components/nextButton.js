import React, { useState, useEffect } from "react";

const CountdownWithPauseAndSkip = ({ onComplete, setId }) => {
  const [timeLeft, setTimeLeft] = useState(15); // Countdown time in seconds
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 0.1, 0)); // Decrease by 0.1s
      }, 100); // Update every 100ms
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused, ]);
//   }, [timeLeft, isPaused, onComplete]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    setTimeLeft(0); // Immediately end the countdown
    onComplete();
    setId((prev) => parseInt(prev) + 1)
  };

  const progress = (timeLeft / 15) * 100; // Calculate progress percentage

  return (
    <div className="flex flex-row items-center space-y-4 space-x-5">
      {/* Circular Countdown */}
      <div className="relative w-24 h-24">
        <svg className="absolute inset-0 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            strokeWidth="3"
            stroke="#1a202c"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            strokeWidth="3"
            stroke="url(#gradient)"
            strokeDasharray="280"
            strokeDashoffset={`${280 - (progress / 100) * 280}`}
            fill="none"
            strokeLinecap="round"
            style={{
              transition: isPaused ? "none" : "stroke-dashoffset 0.1s linear",
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6DD5FA" />
              <stop offset="100%" stopColor="#2980B9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        {/* <button
          onClick={handlePauseResume}
          className="px-4 py-1 font-medium rounded-md bg-gray-700 text-white text-sm hover:bg-gray-600 transition-all duration-200"
        >
          {isPaused ? "Resume" : "Pause"}
        </button> */}
        <button
          onClick={handleSkip}
          className="px-6 py-2 font-semibold rounded-lg text-white hover:text-black hover:bg-green-400 transition-all duration-300"        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CountdownWithPauseAndSkip;
