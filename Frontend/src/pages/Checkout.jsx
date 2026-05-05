import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../validators/schema.js';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  /** * WHAT: React Hook Form Initialization.
   * WHY: To handle state without re-rendering, keeping the checkout fast.
   * HOW: The zodResolver connects our strict rules to this specific form.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur" // Triggers validation when user clicks outside the input
  });

  // Calculate Totals safely
  const subtotal = cart?.reduce((acc, item) => acc + (item.qty * item.product.price), 0) || 0;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + shipping;

  /** * WHAT: Frontend Data Persistence.
   * WHY: Since we don't have a backend yet, we must save the address somewhere.
   * HOW: Saving the Zod-approved 'data' to localStorage to access on the Payment page.
   */
  const onSubmit = (data) => {
    localStorage.setItem("shopvibe_shipping", JSON.stringify(data));
    navigate("/payment"); // Navigating to the next step
  };

  return (
    <div className="checkout-wrapper fade-in">
      {/* HEADER SECTION */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="back-icon">←</span> Back to Shop
      </button>

      <div className="checkout-container">
        
        {/* LEFT COLUMN: THE FORM */}
        <form className="checkout-card glass-panel" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="section-title">Shipping Information</h2>
          
          <div className="form-row">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Full Name" 
                {...register("name")} 
                className={errors.name ? "input-error" : ""}
              />
              {/* FIXED: Proper matching HTML tags for errors */}
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Mobile Number" 
                {...register("mobile")} 
                className={errors.mobile ? "input-error" : ""}
              />
              {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Pincode" 
                {...register("pincode")} 
                className={errors.pincode ? "input-error" : ""}
              />
              {errors.pincode && <p className="error-text">{errors.pincode.message}</p>}
            </div>
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="City" 
                {...register("city")} 
                className={errors.city ? "input-error" : ""}
              />
              {errors.city && <p className="error-text">{errors.city.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="State" 
                {...register("state")} 
                className={errors.state ? "input-error" : ""}
              />
              {errors.state && <p className="error-text">{errors.state.message}</p>}
            </div>
            <div className="input-group">
              <input type="text" value="India" readOnly className="readonly-input" />
            </div>
          </div>

          <div className="input-group">
            <input 
              type="text" 
              placeholder="Area / Sector / Colony" 
              {...register("area")} 
              className={errors.area ? "input-error" : ""}
            />
            {errors.area && <p className="error-text">{errors.area.message}</p>}
          </div>

          <div className="input-group">
            <textarea 
              placeholder="Flat, House no., Building, Apartment" 
              {...register("address")}
              className={errors.address ? "input-error" : ""}
            ></textarea>
            {errors.address && <p className="error-text">{errors.address.message}</p>}
          </div>

          <div className="input-group">
            <input type="text" placeholder="Landmark (Optional)" {...register("landmark")} />
          </div>
          
          <button type="submit" className="primary-orange-btn">Proceed to Payment</button>
        </form>

        {/* RIGHT COLUMN: THE SUMMARY */}
        <div className="summary-card glass-panel">
          <h3 className="section-title">Order Summary</h3>
          <div className="item-preview">
            {cart?.map(item => (
              <div key={item.product._id} className="summary-item">
                <span className="item-name">{item.product.name} <span className="qty-badge">x{item.qty}</span></span>
                <span className="item-price">₹{item.qty * item.product.price}</span>
              </div>
            ))}
          </div>
          
          <hr className="divider" />
          
          <div className="total-line">
            <span>Subtotal</span> <span>₹{subtotal}</span>
          </div>
          <div className="total-line">
            <span>Shipping</span> 
            <span className={shipping === 0 ? "free-shipping" : ""}>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>
          
          <div className="total-line grand-total">
            <span>Total Amount</span> <span>${total}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;