// import { useCart } from '../context/CartContext';
// import './CartDrawer.css';

// export default function CartDrawer() {
//   const { cart, isDrawerOpen, setIsDrawerOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

//   if (!isDrawerOpen) return null;

//   return (
//     <>
//       <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
//       <div className="cart-drawer" id="cart-drawer">
//         <div className="drawer-header">
//           <h3>Your Cart ({cart.length})</h3>
//           <button className="drawer-close" onClick={() => setIsDrawerOpen(false)} aria-label="Close cart">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
//             </svg>
//           </button>
//         </div>

//         <div className="drawer-body">
//           {cart.length === 0 ? (
//             <div className="drawer-empty">
//               <span className="empty-icon">🛒</span>
//               <p>Your cart is empty</p>
//               <button className="btn btn-primary" onClick={() => setIsDrawerOpen(false)}>
//                 Continue Shopping
//               </button>
//             </div>
//           ) : (
//             <ul className="drawer-items">
//               {cart.map(item => (
//                 <li key={item.id} className="drawer-item" id={`cart-item-${item.id}`}>
//                   <img src={item.image} alt={item.name} className="drawer-item-img" />
//                   <div className="drawer-item-info">
//                     <h4 className="drawer-item-name">{item.name}</h4>
//                     <span className="drawer-item-price">${(item.price || 0).toFixed(2)}</span>
//                     <div className="drawer-item-controls">
//                       <div className="qty-controls">
//                         <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
//                         <span>{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
//                       </div>
//                       <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {cart.length > 0 && (
//           <div className="drawer-footer">
//             <div className="drawer-subtotal">
//               <span>Subtotal</span>
//               <span className="subtotal-amount">${cartTotal.toFixed(2)}</span>
//             </div>
//             <button className="btn btn-primary checkout-btn" id="checkout-btn">
//               Proceed to Checkout
//             </button>
//             <button className="btn btn-outline clear-btn" onClick={clearCart}>
//               Clear Cart
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import { use } from "react";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";



export default function CartDrawer() {

  const navigate = useNavigate();

  const handleCart = () => {
    setIsDrawerOpen(false);
    navigate("/checkout");
  }
  
  const { cart, addToCart, removeFromCart, isDrawerOpen, setIsDrawerOpen , decreaseQuantity} = useCart();

  if (!isDrawerOpen) return null;

  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

   return (
    <>
      <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      <div className="cart-drawer">
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, padding: 0, border: 'none' }}>Your Bag ({cart.length})</h2>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

      {cart.length === 0 ? (
          <p className="empty-msg">Your bag is empty. Start "Vibe Shopping"!</p>
        ) : (
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                {/* Product Image and Details */}
                <img src={item.product.image} alt={item.name} />
                
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>${item.product.price}</p>
                  <div className="qty-controls">
                    {/* MINUS BUTTON: Decreases quantity by sending -1 to the backend */}
                    <button onClick={() => decreaseQuantity(item.product._id)}>-</button>
                    
                    <span>{item.qty}</span>
                    
                    {/* PLUS BUTTON: Increases quantity by sending +1 to the backend */}
                    <button onClick={() => addToCart(item.product._id, 1)}>+</button>
                  </div>
                </div>

                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.product._id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
         {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCart}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}