import React, { useContext, useState, useEffect } from 'react';
import { Star, Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartContext } from '../App';
import { useProducts } from '../context/ProductContext';

/**
 * Featured Collection Section
 * 
 * Displays a curated selection of premium products from all categories
 * with elegant hover effects and animations
 */

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { getFeaturedProducts } = useProducts();
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { openCart } = useContext(CartContext);

  // Get featured products from context
  const featuredProducts = getFeaturedProducts();

  // Reset image index when hover ends
  useEffect(() => {
    if (!hoveredProduct) {
      setCurrentImageIndex(0);
    }
  }, [hoveredProduct]);

  // Auto-rotate images when hovering
  useEffect(() => {
    if (hoveredProduct) {
      const product = featuredProducts.find(p => p.id === hoveredProduct);
      
      if (product) {
        setCurrentImageIndex(current => 
          current + 1 >= product.images.length ? 0 : current + 1
        );
      }
    }
  }, [hoveredProduct]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
    openCart();
  };
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const getDisplayImage = (product: any) => {
    if (hoveredProduct === product.id) {
      return product.images[currentImageIndex];
    }
    return product.images[0];
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-[#fdfbf6] via-white to-[#fdfbf6] dark:bg-gradient-to-br dark:from-dark dark:via-dark-lighter dark:to-dark relative overflow-hidden isolate" aria-label="Featured Collection">
      {/* Decorative elements for dark mode */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,179,8,0.15),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Light mode decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.07),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.05),transparent_70%)] dark:opacity-0 pointer-events-none" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-yellow-500/5 dark:via-transparent dark:to-yellow-500/5 dark:animate-shimmer pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-4 tracking-wide dark:text-yellow-500/90 relative">
          FEATURED COLLECTION
          <div className="absolute -inset-x-4 -inset-y-2 bg-yellow-500/10 blur-2xl dark:block hidden animate-pulse" />
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12 md:mb-20 max-w-2xl mx-auto text-base md:text-lg font-light px-4">
          DISCOVER OUR HANDPICKED SELECTIONS FROM EACH COLLECTION
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group relative cursor-pointer transform transition-all duration-500 mx-4 sm:mx-0
                hover:scale-[1.03] hover:shadow-2xl dark:hover:shadow-yellow-500/20 rounded-xl overflow-hidden
                bg-white dark:bg-dark-lighter/50 border border-neutral-100 hover:border-yellow-500/20 
                dark:border-yellow-500/20 backdrop-blur-sm hover:z-10"
            >
              {/* Glow effect for dark mode */}
              <div className="absolute -inset-px bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0
                dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-1000 rounded-xl blur-lg" />
              
              {/* Additional glow effects */}
              <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-yellow-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-1 dark:bg-yellow-500/5 dark:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              
              {/* Image Container */}
              <div className="relative aspect-[3/4] mb-6 overflow-hidden group-hover:shadow-lg 
                group-hover:shadow-yellow-500/10 transition-all duration-700">
                {/* Default Image */}
                <div 
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{ opacity: 1 }}
                >
                  <img
                    src={getDisplayImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 
                      group-hover:scale-110"
                  />
                </div>
                {/* Image Navigation Dots */}
                {hoveredProduct === product.id && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
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
                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-yellow-500 text-white py-3 text-sm font-light tracking-wider
                        hover:bg-yellow-400 transition-all duration-300 relative overflow-hidden group/btn
                        transform hover:scale-105 rounded-lg backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                      ADD TO CART
                    </button>
                    {product.external_link && (
                      <a
                        href={product.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full bg-neutral-800/80 text-white py-3 text-sm font-light 
                          tracking-wider hover:bg-neutral-700 transition-all duration-300 text-center
                          transform hover:scale-105 rounded-lg backdrop-blur-sm"
                      >
                        BUY ON AMAZON
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="text-center group-hover:opacity-80 transition-opacity p-4">
                <p className="text-yellow-500 dark:text-yellow-400 text-sm tracking-wide mb-2 relative">
                  <span className="relative z-10">{product.category}</span>
                  <span className="absolute inset-0 dark:bg-yellow-500/10 blur-xl" />
                </p>
                <Link 
                  to={`/product/${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block group/title"
                >
                  <h3 className="font-light text-neutral-900 dark:text-white mb-3 transition-colors duration-300 
                    group-hover/title:text-yellow-400 relative">
                    <span className="relative z-10">
                    {product.name}
                    </span>
                    <span className="absolute inset-0 dark:bg-yellow-500/5 blur-lg opacity-0 group-hover/title:opacity-100 transition-opacity duration-300" />
                  </h3>
                </Link>
                <p className="text-neutral-600 dark:text-white/90 transition-colors duration-300 relative">
                  <span className="relative z-10">${product.price}</span>
                  <span className="absolute inset-0 dark:bg-yellow-500/5 blur-lg" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;