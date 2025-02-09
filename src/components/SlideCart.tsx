import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface SlideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideCart = ({ isOpen, onClose }: SlideCartProps) => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCart();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-50
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
              <p>Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-yellow-600 hover:text-yellow-500"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-4 bg-white border border-neutral-100 rounded-lg hover:border-neutral-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium mb-1">{item.name}</h3>
                    <p className="text-lg text-neutral-900 mb-2">${item.price}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between mb-4 text-lg font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-yellow-500 text-white py-3 rounded-full hover:bg-yellow-400 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SlideCart;