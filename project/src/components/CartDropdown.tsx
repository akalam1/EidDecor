import React from 'react';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDropdown = () => {
  const { items, removeFromCart, updateQuantity, totalItems } = useCart();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-600">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="w-80 max-h-[32rem] overflow-auto">
      {items.map(item => (
        <div key={item.id} className="flex p-4 border-b border-neutral-200">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover"
          />
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-neutral-600">${item.price}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="mx-2 text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="p-4 bg-neutral-50">
        <div className="flex justify-between mb-4">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <button className="w-full bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-400 transition-colors">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDropdown;