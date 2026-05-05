import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
    const { productId, qty } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.cartItems[itemIndex].qty += qty;
            } else {
                cart.cartItems.push({ product: productId, qty });
            }

            // Save and instantly return. No population required!
            await cart.save();
            return res.status(200).json({ message: "Item added to cart successfully" });
            
        } else {
            // Create and instantly return.
            await Cart.create({
                user: userId,
                cartItems: [{ product: productId, qty }]
            });
            return res.status(201).json({ message: "Cart created and item added" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Cart Update Failed", error: error.message });
    }
};

// Add this to your existing controller file
export const getCartItems = async (req, res) => {
  try {
    // 1. Find the cart where the 'user' field matches the logged-in user's ID
    // 2. 'populate' is the magic that swaps the ID for the full Product data
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
      // Send the full cart object back to React
      res.json(cart);
    } else {
      // If the user has never added anything, send an empty list so the app doesn't crash
      res.json({ cartItems: [] });
    }
  } catch (error) {
    console.error("Fetch Cart Error:", error.message);
    res.status(500).json({ message: "Could not retrieve cart items", error: error.message });
  }
};

export const decreaseCartItem = async (req,res) => {
    const {productId} = req.body;
    const userId = req.user._id;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is missing from request" });
    }

    try{
        let cart = await Cart.findOne({user: userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

        if(itemIndex > -1){
            if(cart.cartItems[itemIndex].qty > 1){
                cart.cartItems[itemIndex].qty -= 1;                
            } else {
                cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
            }
            await cart.save();
            const updatedCart = await cart.populate("cartItems.product");
            res.status(200).json(updatedCart);

        } else {
            res.status(404).json({message: "Item not found in cart"});
        }
    } catch(error){
        res.status(500).json({message: "Error Updating Cart", error: error.message});
    }
};

export const removeItemFromCart = async (req,res) => {
    const productId = req.params.id;
    const userId = req.user._id;

    try{
        let cart = await Cart.findOne({user: userId});

        if(cart){
            cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);

            await cart.save();
            const updatedCart = await cart.populate("cartItems.product");
            res.status(200).json(updatedCart); 
        }
    } catch(error){
        res.status(500).json({message: "Error removing item from cart",error: error.message});
    }
};