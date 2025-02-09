import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartContext } from '../App';
import { useProducts } from '../context/ProductContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { openCart } = useContext(CartContext);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      navigate('/');
    }
  }, [id, products, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br 
        from-[#fdfbf6] via-white to-[#fdfbf6] dark:from-dark dark:via-dark-lighter dark:to-dark">
        <div className="animate-pulse text-yellow-500">Loading...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
    openCart();
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-[#fdfbf6] via-white to-[#fdfbf6] 
      dark:from-dark dark:via-dark-lighter dark:to-dark min-h-screen transition-colors duration-300">
      {/* Decorative elements */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,179,8,0.15),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-yellow-500/5 dark:via-transparent dark:to-yellow-500/5 dark:animate-shimmer pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden bg-white dark:bg-dark-lighter rounded-2xl
              shadow-lg dark:shadow-yellow-500/10 border border-neutral-100 dark:border-yellow-500/20
              group hover:shadow-xl dark:hover:shadow-yellow-500/20 transition-all duration-300 relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 
                      hover:bg-black/40 rounded-full text-white transition-all opacity-0 
                      group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 
                      hover:bg-black/40 rounded-full text-white transition-all opacity-0 
                      group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index
                      ? 'ring-2 ring-yellow-500 dark:ring-yellow-500'
                      : 'ring-1 ring-neutral-200 dark:ring-yellow-500/20 hover:ring-yellow-500/50 dark:hover:ring-yellow-500/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:pl-8 relative">
            {/* Glowing background effect for dark mode */}
            <div className="absolute -inset-4 dark:bg-yellow-500/5 dark:blur-xl opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 pointer-events-none" />
            
            <div className="sticky top-24">
              {/* Product Title and Price */}
              <h1 className="text-3xl font-light mb-4 text-neutral-900 dark:text-white/90">{product.name}</h1>
              <p className="text-2xl mb-6 text-yellow-600 dark:text-yellow-500">${product.price}</p>

              {/* Description */}
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">{product.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center mb-8">
                <span className="mr-4 text-neutral-600 dark:text-neutral-400">Quantity</span>
                <div className="flex items-center border border-neutral-200 dark:border-yellow-500/20 rounded-full
                  bg-white dark:bg-dark-lighter">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-light rounded-l-full
                      text-neutral-600 dark:text-neutral-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-neutral-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-light rounded-r-full
                      text-neutral-600 dark:text-neutral-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart and Wishlist */}
              <div className="flex gap-4 mb-12">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 mr-2 bg-yellow-500 text-white py-4 rounded-full hover:bg-yellow-400 
                    transition-all duration-300 transform hover:scale-[1.02] relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative z-10">
                  Add to Cart
                  </span>
                </button>
                {product.external_link && (
                  <a
                    href={product.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-neutral-800 dark:bg-yellow-500/10 text-white dark:text-yellow-500 
                      py-4 px-6 rounded-full hover:bg-neutral-700 dark:hover:bg-yellow-500/20
                      transition-all duration-300 transform hover:scale-[1.02] text-center
                      relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                      translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <span className="relative z-10">Buy on Amazon</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    // Show toast or notification
                    alert('Link copied to clipboard!');
                  }}
                  className="p-4 border border-neutral-200 dark:border-yellow-500/20 rounded-full 
                  hover:bg-neutral-50 dark:hover:bg-dark-light transition-colors
                  text-neutral-600 dark:text-neutral-400">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Accordion Sections */}
              <div className="border-t border-neutral-200 dark:border-yellow-500/20">
                {/* Product Details */}
                <div className="border-b border-neutral-200 dark:border-yellow-500/20">
                  <button
                    onClick={() => setOpenSection(
                      openSection === 'details' ? null : 'details'
                    )}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white/90 
                      group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                      Product Details
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openSection === 'details' ? 'rotate-180' : ''
                      } text-neutral-400 dark:text-neutral-500 group-hover:text-yellow-500`}
                    />
                  </button>
                  {openSection === 'details' && (
                    <div className="pb-4 text-neutral-600 dark:text-neutral-400">
                      {product.details.map((detail: any, index: number) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-medium mb-2">{detail.title}</h4>
                          <p className="whitespace-pre-line">{detail.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dimensions */}
                <div className="border-b border-neutral-200 dark:border-yellow-500/20">
                  <button
                    onClick={() => setOpenSection(
                      openSection === 'dimensions' ? null : 'dimensions'
                    )}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white/90 
                      group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                      Dimensions
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openSection === 'dimensions' ? 'rotate-180' : ''
                      } text-neutral-400 dark:text-neutral-500 group-hover:text-yellow-500`}
                    />
                  </button>
                  {openSection === 'dimensions' && (
                    <div className="pb-4 text-neutral-600 dark:text-neutral-400">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Length</p>
                          <p>{product.dimensions.length} {product.dimensions.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Width</p>
                          <p>{product.dimensions.width} {product.dimensions.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Height</p>
                          <p>{product.dimensions.height} {product.dimensions.unit}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Care Instructions */}
                <div className="border-b border-neutral-200 dark:border-yellow-500/20">
                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === 'care' ? null : 'care'
                      )
                    }
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white/90 
                      group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                        Care Instructions
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openSection === 'care' ? 'rotate-180' : ''
                      } text-neutral-400 dark:text-neutral-500 group-hover:text-yellow-500`}
                    />
                  </button>
                    {openSection === 'care' && (
                      <div className="pb-4 text-neutral-600 dark:text-neutral-400">
                        <ul className="list-disc pl-4 space-y-2">
                          {product.careInstructions.map((instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;