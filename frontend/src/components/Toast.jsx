import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      id="cart-toast"
      className="cart-toast"
      role="status"
      aria-live="polite"
      style={{ display: 'block', opacity: 1 }}
    >
      {toastMessage}
    </div>
  );
}

