import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartContext } from '../App';
import { useProducts } from '../context/ProductContext';

// Price ranges for filtering
const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: Infinity },
];

// Sort options
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
];

const categoryTitles = {
  eid: 'EID COLLECTION',
  ramadan: 'RAMADAN ESSENTIALS',
  new: 'NEW ARRIVALS',
};

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductsByCategory } = useProducts();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  const { openCart } = useContext(CartContext);
  const products = id ? getProductsByCategory(id) : [];
  
  // Get unique product types from actual products
  const productTypes = Array.from(new Set(products.map(product => 
    product.details.find(d => d.title === 'Product Type')?.content || 'Other'
  )));

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
    openCart();
  };

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    // Apply price filter
    if (selectedPriceRange.length === 2) {
      filtered = filtered.filter(
        product => product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1]
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(product => {
        const productType = product.details.find(d => d.title === 'Product Type')?.content;
        return selectedTypes.includes(productType || 'Other');
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, selectedPriceRange, selectedTypes, sortBy]);

  const handlePriceRangeSelect = (min: number, max: number) => {
    setSelectedPriceRange([min, max]);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="pt-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Category Header */}
      <div className="relative bg-black/40 text-white py-20 px-4 overflow-hidden">
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        {/* Glowing Border */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-light tracking-wider mb-4 text-yellow-500">
            {id && categoryTitles[id as keyof typeof categoryTitles]}
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Discover our curated selection of premium decorative pieces
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-16 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-yellow-500"
            >
              <X className="w-4 h-4" />
              {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-yellow-500 relative"
              >
                Sort By
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                
                {/* Sort Dropdown */}
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl py-2 z-50">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy === option.value ? 'text-yellow-500 bg-neutral-700' : 'text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFiltersOpen && (
            <div className="border-t border-yellow-500/10 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Price Ranges */}
                <div>
                  <h3 className="text-yellow-500 mb-4 font-light">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => handlePriceRangeSelect(range.min, range.max)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedPriceRange[0] === range.min && selectedPriceRange[1] === range.max
                            ? 'bg-yellow-500 text-black'
                            : 'text-neutral-400 hover:bg-neutral-800'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Types */}
                <div>
                  <h3 className="text-yellow-500 mb-4 font-light">Product Type</h3>
                  <div className="space-y-2">
                    {productTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleTypeSelect(type)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedTypes.includes(type)
                            ? 'bg-yellow-500 text-black'
                            : 'text-neutral-400 hover:bg-neutral-800'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedPriceRange.length > 0 || selectedTypes.length > 0) && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedPriceRange([]);
                      setSelectedTypes([]);
                    }}
                    className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 
                      bg-yellow-500/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleProductClick(product.id)}
              className="group relative cursor-pointer transform transition-all duration-300
                hover:scale-105 hover:shadow-2xl rounded-xl overflow-hidden bg-neutral-800/50"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] mb-4 bg-neutral-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                  src={product.images[1] || product.images[0]}
                  alt={`${product.name} - Alternate View`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 ease-out">
                  <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-yellow-500 text-white py-3 text-sm font-light tracking-wider 
                        hover:bg-yellow-400 transition-colors"
                    >
                      ADD TO CART
                    </button>
                    {product.external_link && (
                      <a
                        href={product.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full bg-neutral-800 text-white py-3 text-sm font-light tracking-wider 
                          hover:bg-neutral-700 transition-colors text-center"
                      >
                        BUY ON AMAZON
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {/* Product Info */}
              <div className="text-center p-4">
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="block group/title"
                >
                  <h3 className="text-lg font-light text-white mb-2 
                    group-hover/title:text-yellow-500 transition-colors">
                    {product.name}
                  </h3>
                </div>
                <p className="text-yellow-500/80">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;