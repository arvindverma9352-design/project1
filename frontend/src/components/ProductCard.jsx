import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productLabels, productImages, productCategories } from '../constants/products';

export default function ProductCard({ productKey, livePrice, available = true }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const title = productLabels[productKey] || productKey;
  const image = productImages[productKey] || '/images/vegback.png';
  const category = productCategories[productKey] || 'hari-sabzi';
  const price = Number(livePrice) || 0;
  const isWishlisted = isInWishlist(productKey);

  const handleCardClick = () => {
    navigate(`/product/${productKey}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!available) return;
    addToCart(productKey, price, image, '1kg');
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(productKey, price, image);
  };

  return (
    <div className="product" data-category={category} data-product-key={productKey}>
      {/* Product Image Thumbnail */}
      <div
        className={productKey}
        onClick={handleCardClick}
        style={{
          cursor: 'pointer',
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${title}`}
      />

      {/* Product Name */}
      <h3 className="product-name">{title}</h3>

      {/* Live Price Badge */}
      <div className="product-price-tag">
        ₹{price} / 1kg
      </div>

      {/* Action Buttons */}
      <div className="buttons">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!available}
          style={!available ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Add To Cart
        </button>

        <button
          type="button"
          onClick={handleCardClick}
        >
          ₹{price} / 1kg
        </button>

        <button
          type="button"
          className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          style={isWishlisted ? { background: '#bf654e', color: '#fff' } : {}}
        >
          ♥ Wishlist
        </button>
      </div>

      {/* Availability Badge */}
      <div className={`availability-badge ${available ? 'available' : 'not-available'}`}>
        {available ? 'Available' : 'Not available'}
      </div>
    </div>
  );
}

