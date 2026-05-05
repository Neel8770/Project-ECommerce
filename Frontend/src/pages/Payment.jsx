import './Payment.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Payment = () => {
  // WHAT: Initializing navigation and cart context.
  // WHY: 'navigate' lets us change pages. 'cart' gives us the items. 'clearCart' lets us empty it after a sale.
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cart?.reduce((acc, item) => acc + (item.qty * item.product.price), 0) || 0;
  const totalAmount = subtotal + (subtotal > 500 ? 0 : 40);

  useEffect(() => {
    const savedData = localStorage.getItem("shopvibe_shipping");
    if (savedData) {
      setShippingData(JSON.parse(savedData));
    } else {
      navigate("/checkout");
    }
  }, [navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true); // Tells us it successfully loaded
      script.onerror = () => resolve(false); // Tells us the internet dropped or it blocked
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true); // Disables the button immediately
    
    // Attempt to load the script we wrote above
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      setLoading(false);
      return; // Stops the function entirely if offline
    }
    try {
      // ------------------------------------------
      // STEP A: GET PERMISSION FROM BACKEND
      // ------------------------------------------
      // WHAT: Grab the user's login badge.
      const userStorageString = localStorage.getItem("shopvibe_user");

// WHY: If the string is missing, the user is logged out. We block the request to prevent crashes.
if (!userStorageString) {
  alert("Authentication error: Please log in again.");
  setLoading(false);
  return;
}

const formattedItems = cart.map((item) => ({
  product: item.product._id, // Extract just the ID
  name: item.product.name,   // Extract the name
  price: item.product.price, // Extract the price
  qty: item.qty              // Keep the quantity
}));

// HOW: Parse the string into a JavaScript object, then extract the active JWT.
const userData = JSON.parse(userStorageString);
const token = userData.token;
      // WHAT: Ask backend to create a "Pending" order and give us a Token.
      // WHY: Razorpay's popup will refuse to open without an official 'order_id' from our backend.
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Proves to the backend we are logged in
        },
        body: JSON.stringify({
          totalAmount,
          items: formattedItems,
          shippingAddress: shippingData,
          // HOW: Date.now() ensures every single click generates a brand new unique key for the idempotency check
          idempotencyKey: `front_req_${Date.now()}` 
        })
      });
      const orderData = await orderResponse.json();

      // If the backend crashed or rejected us, stop here.
      if (!orderData.success) {
        alert(orderData.message || "Failed to create order");
        setLoading(false);
        return; 
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount, // The amount in PAISE that our backend returned
        currency: "INR",
        name: "ShopVibe", // Text shown at the top of the popup
        description: "Secure Checkout",
        order_id: orderData.razorpayOrderId, // The golden ticket from our backend!
        
        // STEP C: THE VERIFICATION HANDLER

        handler: async function (response) {
          try {
            // WHAT: Send the proof back to our Node.js backend.
            // WHY: Hackers can easily fake a "Success" message on the frontend. We send the signature to the backend for cryptographic verification.
            const verifyReq = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({
                // These three variables are automatically provided by Razorpay inside this handler
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyReq.json();
            if (verifyData.success) {
              // HOW: If backend says the math matches, we delete the saved address, empty the cart, and go to the Thank You page!
              localStorage.removeItem("shopvibe_shipping");
              if (clearCart) clearCart(); 
              navigate("/products"); 
            } else {
              alert("Payment verification failed! Hacker detected or math failed.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment completed, but verification failed. Check your orders page.");
          }
        },
        prefill: {
          name: shippingData?.name || "",
          contact: shippingData?.mobile || "",
        },
        theme: {
          color: "#ff6b00", // Makes the Razorpay button match ShopVibe's orange theme
        },
      };

      // STEP D: OPEN THE POPUP
      // ------------------------------------------
      // WHAT: Physically creates the Razorpay window using the options we just built.
      const paymentObject = new window.Razorpay(options);
      // WHAT: A tiny listener that alerts the user if they type their credit card wrong.
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      // WHAT: The command that actually makes the window appear on screen!
      paymentObject.open();

      } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      // WHAT: Un-disables the Pay button whether the payment succeeded, failed, or crashed.
      setLoading(false);
    }
  };
  return (
    <div className="checkout-wrapper fade-in">
      <div className="checkout-container" style={{ gridTemplateColumns: "1fr", maxWidth: "600px", margin: "0 auto" }}>
        <div className="glass-panel" style={{ textAlign: "center", padding: "50px 30px" }}>
          
          <h2 className="section-title">Final Step: Payment</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
            You are paying <strong>${totalAmount}</strong> for your ShopVibe order.
          </p>
          
          {/* WHAT: The trigger. WHY: User clicks this, which triggers handlePayment(), starting the whole process above. */}
          <button 
            onClick={handlePayment} 
            className="primary-orange-btn" 
            disabled={loading} // HOW: Grays out the button if loading === true
            style={{ fontSize: "1.2rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Loading Secure Gateway..." : "Pay Now Securely"}
          </button>
          
          <p style={{ marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Secured by <strong>Razorpay</strong>. UPI, Cards, and NetBanking accepted.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Payment;