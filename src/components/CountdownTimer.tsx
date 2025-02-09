import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CountdownTimer = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const targetDateRef = useRef(new Date());

  useEffect(() => {
    // Get current date and set target date
    const now = new Date();
    const targetDate = new Date(2024, 1, 28, 23, 59, 59, 999); // February 28th, 2024 at 23:59:59

    // If current date is after Feb 28th, set target to next year
    if (now > targetDate) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    targetDateRef.current = targetDate;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDateRef.current.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="bg-gradient-to-br from-[#fdfbf6] via-[#fff9e6] to-[#fdfbf6] dark:from-yellow-900/20 dark:via-yellow-800/10 dark:to-yellow-900/20 p-8 rounded-2xl 
      shadow-lg relative overflow-hidden border border-yellow-200/50 dark:border-yellow-500/20 backdrop-blur-sm
      dark:shadow-yellow-500/5"
    >
      {/* Animated border effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-300/10 
        dark:from-yellow-500/10 dark:to-yellow-400/10 animate-pulse rounded-2xl"
        style={{ filter: 'blur(40px)' }}
      />

      {/* Futuristic circuit lines */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMEwyMCA0ME0wIDIwTDQwIDIwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]
        opacity-30 dark:opacity-10"
      />

      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8 opacity-5">
        <Calendar className="w-full h-full" />
      </div>
      <h2 className="text-2xl font-semibold text-yellow-800 dark:text-yellow-500 text-center mb-2 relative z-10">
        CountDown Till Ramadan
      </h2>
      <p className="text-yellow-600/80 dark:text-yellow-400/80 text-center mb-6 relative z-10">
        Limited time offer - Don't miss out!
      </p>
      <div className="flex justify-center gap-4 relative z-10">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div
              className="bg-white dark:bg-dark-lighter w-20 h-20 rounded-lg shadow-md dark:shadow-yellow-500/10 flex items-center justify-center mb-2 
              relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                {value.toString().padStart(2, '0')}
              </span>
              <div className="absolute inset-0 bg-yellow-500/5 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <span className="text-sm text-yellow-700 dark:text-yellow-400 capitalize">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center relative">
        <button
          onClick={() => {
            const categoriesSection =
              document.getElementById('categories-section');
            if (categoriesSection) {
              categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group relative bg-yellow-500 text-white px-10 py-3 rounded-full text-sm 
            hover:bg-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl
            hover:shadow-yellow-500/20"
        >
          <span className="relative z-10">Shop Now</span>
          <div
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full
            opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          >
            <div className="relative mt-4">
              <div
                className="w-0.5 h-12 bg-gradient-to-b from-yellow-500 to-transparent
                animate-pulse mx-auto"
              />
              <ChevronDown
                className="w-6 h-6 text-yellow-500 absolute top-full left-1/2 
                transform -translate-x-1/2 animate-bounce"
              />
            </div>
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full">
            <div
              className="absolute inset-0 rounded-full bg-yellow-400/50 transform scale-0 
              group-hover:scale-150 transition-transform duration-700 opacity-0 
              group-hover:opacity-100"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;
