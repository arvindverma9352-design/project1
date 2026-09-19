import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import StoreBanner from '../components/StoreBanner';
import Toast from '../components/Toast';
import { useStore } from '../context/StoreContext';
import {
  productListOrder,
  productLabels,
  productHinglish,
  productCategories
} from '../constants/products';

export default function Home() {
  const { prices1Kg, products: backendProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Map backend products availability
  const availabilityMap = useMemo(() => {
    const map = {};
    backendProducts.forEach((p) => {
      const key = (p.key || p.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key) {
        map[key] = p.available !== false;
      }
    });
    return map;
  }, [backendProducts]);

  // Filtered product keys
  const visibleProductKeys = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return productListOrder.filter((key) => {
      const title = (productLabels[key] || key).toLowerCase();
      const hinglish = (productHinglish[key] || '').toLowerCase();
      const category = productCategories[key] || 'hari-sabzi';

      const matchesSearch = !term || title.includes(term) || hinglish.includes(term);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <>
      <Toast />
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <StoreBanner />

      <main className="home-main">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="hero-content">
            <p className="hero-kicker">Freshness, delivered daily</p>
            <h1>
              Good food starts<br />
              <span>with good greens.</span>
            </h1>
            <p className="hero-description">
              Pick farm-fresh vegetables for a brighter, healthier kitchen.
            </p>
            <a className="hero-button" href="#products">
              Explore vegetables <span>↓</span>
            </a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img src="/logo.png" alt="" className="hero-logo" />
          </div>
        </section>

        {/* Section Heading & Counter */}
        <div className="products-heading">
          <div>
            <p className="section-kicker">From our farm to you</p>
            <h2>Shop fresh picks</h2>
          </div>
          <span className="product-count">
            {visibleProductKeys.length} fresh choice{visibleProductKeys.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Products Grid */}
        <div className="products" id="products">
          {visibleProductKeys.map((key) => (
            <ProductCard
              key={key}
              productKey={key}
              livePrice={prices1Kg[key]}
              available={availabilityMap[key] !== false}
            />
          ))}
        </div>

        {/* No Products Found Message */}
        {visibleProductKeys.length === 0 && (
          <div id="no-products-message" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '1.2rem', color: '#6a776f' }}>
              Oops! Koi sabzi nahi mili '{searchTerm}'. Kuch aur try karein.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

