import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load wishlist from backend if logged in
  useEffect(() => {
    if (currentUser && (currentUser._id || currentUser.id)) {
      const userId = currentUser._id || currentUser.id;
      api.getWishlist(userId)
        .then((data) => {
          if (Array.isArray(data.wishlist)) {
            setWishlist(data.wishlist);
            localStorage.setItem('wishlist', JSON.stringify(data.wishlist));
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Persist locally
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (productKey, price, image) => {
    let updatedList;
    const exists = wishlist.some((item) => (typeof item === 'string' ? item === productKey : item.id === productKey));

    if (exists) {
      updatedList = wishlist.filter((item) => (typeof item === 'string' ? item !== productKey : item.id !== productKey));
    } else {
      updatedList = [
        ...wishlist,
        {
          id: productKey,
          name: productKey,
          price: Number(price) || 0,
          image: image || `/images/${productKey}.png`
        }
      ];
    }

    setWishlist(updatedList);

    // Sync with backend if logged in
    if (currentUser && (currentUser._id || currentUser.id)) {
      const userId = currentUser._id || currentUser.id;
      try {
        await api.updateWishlist(userId, updatedList);
      } catch (err) {}
    }

    return !exists;
  };

  const isInWishlist = (productKey) => {
    return wishlist.some((item) => (typeof item === 'string' ? item === productKey : item.id === productKey));
  };

  const removeFromWishlist = async (productKey) => {
    const updated = wishlist.filter((item) => (typeof item === 'string' ? item !== productKey : item.id !== productKey));
    setWishlist(updated);

    if (currentUser && (currentUser._id || currentUser.id)) {
      const userId = currentUser._id || currentUser.id;
      try {
        await api.updateWishlist(userId, updated);
      } catch (err) {}
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

