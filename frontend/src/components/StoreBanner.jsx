import React from 'react';
import { useStore } from '../context/StoreContext';

export default function StoreBanner() {
  const { isStoreOpen } = useStore();

  if (isStoreOpen) return null;

  return (
    <div id="store-closed-banner" className="store-closed-banner" style={{ display: 'flex' }}>
      <span>🚫</span>
      <div>
        <strong>Store Abhi Band Hai (Closed)</strong>
        <p>Hum orders abhi accept nahi kar rahe hain. Kripya thodi der baad visit karein.</p>
      </div>
    </div>
  );
}

