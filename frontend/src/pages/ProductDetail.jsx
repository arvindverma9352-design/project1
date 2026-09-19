import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { productLabels, productImages, productListOrder } from '../constants/products';

export default function ProductDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, refreshProducts } = useStore();

  const productKey = (key || 'patato').toLowerCase().replace(/[^a-z0-9]/g, '');
  const title = productLabels[productKey] || productKey;
  const image = productImages[productKey] || '/images/vegback.png';

  // Find backend product info if available
  const backendProduct = useMemo(() => {
    return products.find((p) => (p.key || p.id || '').toLowerCase().replace(/[^a-z0-9]/g, '') === productKey);
  }, [products, productKey]);

  // Derived prices for 250g, 500g, 1kg
  const prices = useMemo(() => {
    if (backendProduct && backendProduct.prices) {
      return {
        '250g': Number(backendProduct.prices['250g']) || Math.round((Number(backendProduct.prices['1kg']) || 100) * 0.3),
        '500g': Number(backendProduct.prices['500g']) || Math.round((Number(backendProduct.prices['1kg']) || 100) * 0.55),
        '1kg': Number(backendProduct.prices['1kg']) || 100
      };
    }
    return {
      '250g': 30,
      '500g': 55,
      '1kg': 100
    };
  }, [backendProduct]);

  const available = backendProduct ? backendProduct.available !== false : true;
  const description = backendProduct?.description || 'Farm-fresh vegetable delivered straight from local fields to your kitchen.';

  // Related products
  const relatedKeys = useMemo(() => {
    return productListOrder
      .filter((k) => k !== productKey)
      .slice(0, 6);
  }, [productKey]);

  return (
    <>
      <Toast />
      <Navbar />

      <div className="page-shell">
        <main>
          <section className="product-detail-shell">
            {/* Left: Product Image */}
            <div className="detail-visual">
              <img src={image} alt={title} className="detail-image" />
            </div>

            {/* Right: Product Info & Variant Grid */}
            <div className="detail-content">
              <span className="detail-tag">Farm Fresh</span>
              <h1 className="detail-title">{title}</h1>
              <p className="detail-desc">{description}</p>

              <div className="detail-perks">
                <span>Direct from farm</span>
                <span>Sorted & cleaned</span>
                <span>Daily delivery</span>
              </div>

              {available ? (
                <div className="price-grid">
                  {Object.entries(prices).map(([weight, price]) => (
                    <div key={weight} className="weight-card">
                      <div className="weight-head">
                        <span>{weight}</span>
                        <strong>₹{price}</strong>
                      </div>
                      <button
                        type="button"
                        className="price-button"
                        onClick={() => addToCart(productKey, price, image, weight)}
                      >
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="availability-card" style={{ padding: '20px', background: '#ffebee', borderRadius: '12px', marginTop: '20px' }}>
                  <h3 style={{ color: '#c62828', margin: '0 0 8px' }}>Currently unavailable</h3>
                  <p style={{ margin: 0, color: '#616161' }}>This vegetable is not available right now. Please check back later.</p>
                </div>
              )}
            </div>
          </section>

          {/* Related Vegetables */}
          <section className="related-section">
            <div className="related-header">
              <h2>More vegetables</h2>
              <p>Explore fresh picks you may love</p>
            </div>
            <div className="related-grid">
              {relatedKeys.map((relKey) => (
                <article key={relKey} className="related-card">
                  <div className="related-image">
                    <img src={productImages[relKey]} alt={productLabels[relKey]} />
                  </div>
                  <div className="related-copy">
                    <h3>{productLabels[relKey]}</h3>
                  </div>
                  <Link to={`/product/${relKey}`} className="related-link">
                    View details
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
