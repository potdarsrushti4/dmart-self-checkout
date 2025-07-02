// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// Decode JWT token
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const userId = decoded?.userId;
    console.log("Decoded Token", decoded);
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`);
                setCart(res.data);
            } catch (err) {
                console.error("Failed to fetch cart", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchCart();
    }, [userId]);

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${userId}/${productId}`);
            setCart(prev => ({
                ...prev,
                items: prev.items.filter(item => item.productId._id !== productId)
            }));
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update-quantity`, {
                userId,
                productId,
                quantity: newQuantity,
            });

            // Re-fetch cart after update
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Quantity update failed", err);
        }
    };


    if (loading) return <p>Loading cart...</p>;
    if (!cart || cart.items.length === 0) return <p style={{ color: "#222",textAlign: "center" }}>Your cart is empty 🛒</p>;

    return (
        <div className="register-container">
            <h2>🛒 Your Cart</h2>
            {cart.items.map(item => (
                <div key={item.productId._id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
                    <p><strong>{item.productId.name}</strong></p>
                    <p>Price: ₹{item.productId.price}</p>
                    <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span><strong>Quantity:</strong></span>

                        <button
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{
                                backgroundColor: "#2e7d32",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                cursor: "pointer"
                            }}
                        >-</button>

                        <span style={{
                            backgroundColor: "#2e7d32",
                            color: "#fff",
                            padding: "5px 15px",
                            borderRadius: "5px"
                        }}>
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                            style={{
                                backgroundColor: "#2e7d32",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                cursor: "pointer"
                            }}
                        >+</button>
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
  <button
    onClick={() => handleRemove(item.productId._id)}
    style={{
      backgroundColor: "#111",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Remove ❌
  </button>
</div>

                </div>
            ))}
        </div>
    );
};

export default Cart;
