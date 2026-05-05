// import { useCart } from '../context/CartContext';
// import './ProductCard.css';

// export default function ProductCard({ product, onViewDetails }) {
//   const { addToCart } = useCart();

//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : null;

//   const renderStars = (rating) => {
//     const stars = [];
//     const full = Math.floor(rating);
//     const hasHalf = rating % 1 >= 0.5;
//     for (let i = 0; i < 5; i++) {
//       if (i < full) {
//         stars.push(<span key={i} className="star filled">★</span>);
//       } else if (i === full && hasHalf) {
//         stars.push(<span key={i} className="star half">★</span>);
//       } else {
//         stars.push(<span key={i} className="star">★</span>);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div className="product-card" id={`product-card-${product._id || product.id}`}>
//       <div className="card-image-wrapper" onClick={() => onViewDetails?.(product)}>
//         {product.badge && <span className="card-badge">{product.badge}</span>}
//         {discount && <span className="card-discount">-{discount}%</span>}
//         <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
//         <div className="card-overlay">
//           <span>Quick View</span>
//         </div>
//       </div>

//       <div className="card-body">
//         <span className="card-category">{product.category}</span>
//         <h3 className="card-title" onClick={() => onViewDetails?.(product)}>{product.name}</h3>

//         <div className="card-rating">
//           <div className="stars">{renderStars(product.rating)}</div>
//           <span className="review-count">({product.reviews.toLocaleString()})</span>
//         </div>

//         <div className="card-price-row">
//           <div className="card-prices">
//             <span className="card-price">${(product.price || 0).toFixed(2)}</span>
//             {product.originalPrice && (
//               <span className="card-original-price">${product.originalPrice.toFixed(2)}</span>
//             )}
//           </div>
//           <button className="add-to-cart-btn" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {

  const { addToCart } = useCart();
  const handleAdd = (e) => {
    e.preventDefault(); 
    addToCart(product._id, 1); //it tells the brain to add this id to MongoDB
  };
  return (
    <div className="product-card">
      {/* WHAT: Wrapping the top part in a Link */}
      {/* WHY: So if a user clicks the image or title, they go to the detail page */}
      {/* HOW: Uses the unique _id from your MongoDB collection */}
      <Link to={`/product/${product._id}`} className="card-link">
        <img src={product.image} alt={product.name} className="card-img" />
                <div className="card-info">
          <h3>{product.name}</h3>
          <p className="category">{product.category}</p>
          <p className="price">${product.price}</p>
        </div>
      </Link>

      <button className="add-to-cart-btn" onClick={handleAdd}>
        + Add to Cart
      </button>
    </div>
  );
}
