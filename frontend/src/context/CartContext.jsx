import React, { createContext, useContext, useState, useEffect } from 'react';
import { productImages } from '../constants/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? '' : current));
    }, 2500);
  };

  const addToCart = (productKey, price, image, weight = '1kg') => {
    const isStoreOpen = localStorage.getItem('vegetable-mart-store-open');
    if (isStoreOpen === 'false') {
      showToast('⚠️ Store is currently closed for orders');
      return false;
    }

    const img = image || productImages[productKey] || '/images/vegback.png';
    const numPrice = Number(price) || 0;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.name === productKey && (item.weight || '1kg') === weight
      );

      if (existingIdx >= 0) {
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            name: productKey,
            price: numPrice,
            image: img,
            quantity: 1,
            weight
          }
        ];
      }
    });

    showToast(`Added to cart (${weight})`);
    return true;
  };

  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const item = updated[index];
      if (!item) return prevCart;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...item, quantity: newQty };
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
