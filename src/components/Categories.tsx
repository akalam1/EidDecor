import React, { useState, useEffect } from 'react';
import { Star, Moon, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Shop by Categories Section
 * 
 * Displays main product categories in a grid layout with hover animations
 * Inspired by LARQ's shop section design
 */
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'eid',
    title: 'EID COLLECTION',
    description: 'Discover elegant decor pieces for your Eid celebration',
    icon: Star,
    allImages: [
      'https://images.pexels.com/photos/9127752/pexels-photo-9127752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c',
      'https://images.unsplash.com/photo-1576158674803-56f6be5662eb'
    ]
  },
  {
    id: 'ramadan',
    title: 'RAMADAN ESSENTIALS',
    description: 'Create a warm and inviting atmosphere for Ramadan',
    icon: Moon,
    allImages: [
      'https://sc04.alicdn.com/kf/H911092076d7043c9ae4e39178f467341V.jpg',
      'https://images.unsplash.com/photo-1561626423-a51b45aef0a1',
      'https://images.unsplash.com/photo-1579975096649-e773152b04cb'
    ]
  },
  {
    id: 'new',
    title: 'NEW ARRIVALS',
    description: 'Shop our latest festive decorations and accessories',
    icon: Sparkles,
    allImages: [
      'https://tmsgift.com/wp-content/uploads/2024/01/Model-1-Moon-5.jpg',
      'https://images.unsplash.com/photo-1632923057155-dd35366509c6',
      'https://images.unsplash.com/photo-1530034424313-9d4ac61cc5c9'
    ]
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Reset image index when hover ends
  useEffect(() => {
    if (!hoveredCategory) {
      setCurrentImageIndex(0);
    }
  }, [hoveredCategory]);

  // Auto-rotate images when hovering
  useEffect(() => {
    if (hoveredCategory) {
      const timer = setInterval(() => {
        const category = categories.find(c => c.id === hoveredCategory);
        if (category) {
          setCurrentImageIndex(current => 
            current + 1 >= category.allImages.length ? 0 : current + 1
          );
        }
      }, 2000); // Change image every 2 seconds

      return () => clearInterval(timer);
    }
  }, [hoveredCategory]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const getDisplayImage = (category: typeof categories[0]) => {
    if (hoveredCategory === category.id) {
      return category.allImages[currentImageIndex];
    }
    return category.allImages[0];
  };

  return (
    <section id="categories-section" className="relative py-24 px-4 bg-gradient-to-b from-[#fdfbf6] via-[#fff9e6] to-[#fdfbf6] 
      dark:from-dark dark:via-dark-lighter dark:to-dark isolate" aria-label="Shop by Categories">
      {/* Futuristic grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMEwyMCA0ME0wIDIwTDQwIDIwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-30 dark:opacity-5" />
      
      {/* Light mode glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.1),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.08),transparent_70%)] dark:opacity-0 pointer-events-none" />
      
      {/* Dark mode glow effects */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,179,8,0.15),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-yellow-500/5 dark:via-transparent dark:to-yellow-500/5 dark:animate-shimmer pointer-events-none" />

      {/* Animated guide arrow when scrolled from countdown */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 opacity-0 animate-fadeIn animation-delay-300">
        <ChevronDown className="w-8 h-8 text-yellow-500 animate-bounce" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <h2 className="text-4xl font-light text-center mb-4 text-neutral-900 dark:text-yellow-500/90 tracking-wide relative z-10">
            EXPLORE COLLECTIONS
          </h2>
          {/* Glowing underline */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-yellow-500 dark:bg-yellow-500/70
            animate-glow rounded-full" />
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-20 max-w-2xl mx-auto text-lg font-light relative z-10 dark:text-neutral-300">
          Discover our curated collections of beautiful decorations for your celebrations
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative aspect-[4/5] overflow-hidden bg-white rounded-2xl transform 
                  hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl dark:bg-dark-lighter
                  hover:shadow-yellow-500/20 dark:hover:shadow-yellow-500/30 w-full text-left cursor-pointer
                  dark:border dark:border-yellow-500/20 backdrop-blur-sm"
              >
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent 
                  group-hover:border-yellow-500/50 dark:group-hover:border-yellow-500/30 
                  transition-colors duration-500" />
                
                {/* Dark mode glow effect */}
                <div className="absolute -inset-px bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0
                  dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-sm" />
                
                {/* Additional glow effects */}
                <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-yellow-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 dark:bg-yellow-500/5 dark:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={getDisplayImage(category)}
                    alt={category.title}
                    className="w-full h-full object-cover transition-all duration-1000 ease-out
                      group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 
                    transition-colors duration-700" />
                  {/* Image Navigation Dots */}
                  {hoveredCategory === category.id && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {category.allImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            currentImageIndex === index 
                              ? 'bg-white w-4' 
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
                  <div className="space-y-6 transform translate-y-4 group-hover:translate-y-0 
                    transition-transform duration-700 ease-out">
                    <Icon className="w-8 h-8 text-yellow-500 mx-auto opacity-0 group-hover:opacity-100 
                      transition-opacity duration-700 delay-100" />
                    <div>
                      <h3 className="text-xl font-light text-white tracking-widest mb-3 relative">
                        {category.title}
                        {/* Glowing line */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 
                          bg-yellow-500/0 group-hover:bg-yellow-500 transition-all duration-700 delay-200" />
                        <div className="absolute inset-0 dark:bg-yellow-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></h3>
                      <p className="text-white/90 text-sm font-light tracking-wide max-w-xs mx-auto 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                        {category.description}
                      </p>
                    </div>
                    <div
                      className="mt-6 px-8 py-3 bg-white text-neutral-900 text-sm tracking-wider 
                        opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300
                        hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:text-white dark:text-white
                        dark:bg-dark-lighter dark:text-neutral-200 inline-flex items-center justify-center 
                        gap-2 rounded-full relative overflow-hidden shadow-lg 
                        group-hover:shadow-yellow-500/20">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <span className="relative z-10">SHOP NOW</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;