// src/pages/Checkout.jsx
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

const Checkout = () => {
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const userId = decoded?.userId;
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCart(res.data);
      } catch (err) {
        console.error("Checkout load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCart();
  }, [userId]);

  const getTotal = () => {
    return cart?.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    try {
      // simulate order placed
      setOrderPlaced(true);

      // clear cart
      await axios.delete(`http://localhost:5000/api/cart/${userId}/clear`);
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  if (loading) return <p>Loading checkout...</p>;
  if (orderPlaced) return <h2>🎉 Order placed successfully!</h2>;

  return (
    <div className="register-container">
      <h2>🧾 Checkout</h2>
      {cart?.items.map(item => (
        <div key={item.productId._id}>
          <p>{item.productId.name} - ₹{item.productId.price} × {item.quantity}</p>
        </div>
      ))}
      <h3 style={{ color: "#222" }}>Total: ₹{getTotal()}</h3>

      <button onClick={handlePayment} style={{
        marginTop: '1rem',
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Pay & Place Order 💳
      </button>
    </div>
  );
};

export default Checkout;
