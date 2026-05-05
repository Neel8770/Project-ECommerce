// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import ProductCard from '../components/ProductCard';
// import '../pages/Product.css'; 

// export default function Product() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');
//   const [sortBy, setSortBy] = useState('newest');

//   // --- 1. THE API CALL to Backend Port
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         // I  have use the full URL as i dont want proxy config
//         const { data } = await axios.get('http://localhost:5000/api/products');
        
//         // Handle different possible response shapes
//         const finalData = Array.isArray(data) ? data : (data.products || []);
//         setProducts(finalData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || "Cannot connect to Backend");
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // --- 2. SEARCH & SORT LOGIC ---
//   const filteredProducts = useMemo(() => {
//     let result = [...products];

//     // Search by Name or Category
//     if (search) {
//       result = result.filter(p =>
//         p.name.toLowerCase().includes(search.toLowerCase()) ||
//         p.category.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Sorting Logic
//     switch (sortBy) {
//       case 'price-low':
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high':
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case 'name':
//         result.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       default:
//         // Sort by newest (using the createdAt timestamp from MongoDB)
//         result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }

//     return result;
//   }, [products, search, sortBy]);

//   if (loading) return <div className="status">Loading products from database...</div>;
//   if (error) return <div className="status error">Error: {error}</div>;

//   return (
//     <div className="product-page-container">
//       {/* Search and Sort Header */}
//       <header className="product-controls">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="sort-dropdown">
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="newest">Newest First</option>
//             <option value="price-low">Price: Low to High</option>
//             <option value="price-high">Price: High to Low</option>
//             <option value="name">A - Z</option>
//           </select>
//         </div>
//       </header>

//       {/* Grid Display */}
//       <div className="products-grid">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product) => (
//             <ProductCard 
//               key={product._id} 
//               product={product} 
//             />
//           ))
//         ) : (
//           <p className="no-data">No products found matching "{search}"</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import '../pages/Product.css';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/products');
        const finalData = Array.isArray(data) ? data : (data.products || []);
        setProducts(finalData);
        setLoading(false);
      } catch (err) {
        setError("Backend Connection Failed");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH LOGIC: Filters by name or category (case-insensitive)
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORTING LOGIC: Re-orders the array based on user choice
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Logic: Uses the MongoDB 'createdAt' timestamp to show the latest gear first
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }, [products, search, sortBy]);

  if (loading) return <div className="status">Loading the collection...</div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="product-page-container">
      {/* WHAT: Header with Search and Sort inputs */}
      {/* WHY: This gives the user control over the "Vibe" of their shopping experience */}
      <header className="product-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest Arrival</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </header>

      {/* WHAT: The Grid of ProductCards */}
      {/* WHY: This is where we loop through the filtered/sorted results */}
      {/* HOW: For every product, we render a ProductCard component */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="no-data">No products match your search "{search}"</p>
        )}
      </div>
    </div>
  );
}