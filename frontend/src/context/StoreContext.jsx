import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { default1KgPrices } from '../constants/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [prices1Kg, setPrices1Kg] = useState({ ...default1KgPrices });
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);

        // Update 1kg prices map
        const newPrices = { ...default1KgPrices };
        data.products.forEach((item) => {
          const rawKey = item.key || item.id || item.title || '';
          const key = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!key) return;

          let price = 0;
          if (item.prices && typeof item.prices === 'object') {
            price = Number(item.prices['1kg'] || item.prices['1KG'] || item.prices['500g'] || item.prices['250g']);
          }
          if (!price || isNaN(price)) {
            price = Number(item.price);
          }
          if (price && !isNaN(price) && price > 0) {
            newPrices[key] = price;
          }
        });
        setPrices1Kg(newPrices);
      }
    } catch (e) {
      console.warn('Could not sync products from API:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshStoreStatus = async () => {
    try {
      const data = await api.getStoreStatus();
      if (data && typeof data.isOpen === 'boolean') {
        setIsStoreOpen(data.isOpen);
        localStorage.setItem('vegetable-mart-store-open', data.isOpen ? 'true' : 'false');
      }
    } catch (e) {}
  };

  useEffect(() => {
    refreshProducts();
    refreshStoreStatus();

    // Re-sync on focus/visibility change (like returning from another tab or screen)
    const handleFocus = () => {
      refreshProducts();
      refreshStoreStatus();
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handleFocus);
    };
  }, []);

  return (
    <StoreContext.Provider value={{
      products,
      prices1Kg,
      isStoreOpen,
      loading,
      refreshProducts,
      refreshStoreStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

