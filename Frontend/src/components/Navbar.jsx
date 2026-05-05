// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import './Navbar.css';

// export default function Navbar() {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const { cartCount, setIsDrawerOpen } = useCart();
//   const { isAuthenticated, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     setIsMobileOpen(false);
//     navigate('/login');
//   };

//   const commonLinks = [
//     { path: '/', label: 'Home' },
//   ];

//   return (
//     <nav className="navbar" id="main-navbar">
//       <div className="container navbar-inner">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-icon">🛒</span>
//           <span className="logo-text">Shop<span className="logo-accent">Vibe</span></span>
//         </Link>

//         <ul className={`navbar-links ${isMobileOpen ? 'open' : ''}`}>
//           {commonLinks.map(link => (
//             <li key={link.path}>
//               <Link
//                 to={link.path}
//                 className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
//                 onClick={() => setIsMobileOpen(false)}
//               >
//                 {link.label}
//                 {location.pathname === link.path && <span className="nav-indicator" />}
//               </Link>
//             </li>
//           ))}
          
//           {isAuthenticated ? (
//             <>
//               <li>
//                 <Link
//                   to="/products"
//                   className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
//                   onClick={() => setIsMobileOpen(false)}
//                 >
//                   Products
//                   {location.pathname === '/products' && <span className="nav-indicator" />}
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/profile"
//                   className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
//                   onClick={() => setIsMobileOpen(false)}
//                 >
//                   Profile
//                   {location.pathname === '/profile' && <span className="nav-indicator" />}
//                 </Link>
//               </li>
//               <li>
//                 <button className="nav-link" onClick={handleLogout} style={{ background: 'transparent' }}>
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 <Link to="/login" className="nav-link" onClick={() => setIsMobileOpen(false)}>Log In</Link>
//               </li>
//               <li>
//                 <Link to="/register" className="nav-link" style={{ color: 'var(--color-primary)' }} onClick={() => setIsMobileOpen(false)}>Sign Up</Link>
//               </li>
//             </>
//           )}
//         </ul>

//         <div className="navbar-actions">
//           <button
//             className="cart-btn"
//             id="cart-toggle-btn"
//             onClick={() => setIsDrawerOpen(true)}
//             aria-label="Open cart"
//           >
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
//               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
//             </svg>
//             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
//           </button>

//           <button
//             className={`hamburger ${isMobileOpen ? 'open' : ''}`}
//             id="mobile-menu-btn"
//             onClick={() => setIsMobileOpen(!isMobileOpen)}
//             aria-label="Toggle menu"
//           >
//             <span /><span /><span />
//           </button>
//         </div>
//       </div>

//       {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}
//     </nav>
//   );
// }

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();

  // Logic: Sum up quantities for the badge
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <nav className="navbar">
      {/* 1. LOGO SECTION */}
      <div className="nav-logo">
        <Link to="/" onClick={closeMobile}>Vibe<span>Store</span></Link>
      </div>

      {/* 2. LINKS SECTION — gets class "open" on mobile */}
      <div className={`nav-links ${isMobileOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={closeMobile}>Home</NavLink>
        <NavLink to="/products" onClick={closeMobile}>Products</NavLink>
        
        {isAuthenticated ? (
          <>
            <NavLink to="/profile" onClick={closeMobile}>Profile</NavLink>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); closeMobile(); }} className="logout-btn">
              Logout
            </a>
          </>
        ) : (
          <NavLink to="/login" onClick={closeMobile}>Login</NavLink>
        )}

        {/* 3. CART TRIGGER */}
        <button 
          className="cart-link" 
          onClick={() => { setIsDrawerOpen(true); closeMobile(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 10px' }}
        >
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* 4. HAMBURGER BUTTON — visible only on mobile via CSS */}
      <button
        className={`hamburger ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* 5. MOBILE OVERLAY */}
      {isMobileOpen && <div className="mobile-overlay" onClick={closeMobile} />}
    </nav>
  );
}