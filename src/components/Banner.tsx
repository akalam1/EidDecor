import React, { useState, useEffect, useRef } from 'react';
import { Star, Moon, ShoppingBag } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://m.media-amazon.com/images/I/81RLKdQnLyL.jpg',
    caption: 'Elegant Ramadan Lanterns',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/7956576/pexels-photo-7956576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Traditional Islamic Patterns',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/7956663/pexels-photo-7956663.jpeg',
    caption: 'Modern Eid Celebrations',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/9127163/pexels-photo-9127163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Festive Decorations',
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const scrollToCategories = () => {
    const categoriesSection = document.querySelector('#categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms] ease-linear"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          </div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-200/60 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <Moon
            key={i}
            className="absolute text-yellow-100/40 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 opacity-0 animate-fadeIn">
            Transform Your Space for
            <span className="block text-yellow-200">Ramadan & Eid</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 opacity-0 animate-fadeIn animation-delay-300">
            Discover our curated collection of elegant decorations that bring warmth and joy to your celebrations
          </p>
          <button 
            onClick={scrollToCategories}
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold 
            flex items-center justify-center mx-auto gap-2 transition-all transform hover:scale-105 
            opacity-0 animate-fadeIn animation-delay-600">
            <ShoppingBag className="w-5 h-5" />
            Shop the Collection
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;