import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <img src="/dmart_logo.png" alt="DMart Logo" className="logo" />
      <h1>Welcome to DMart Self-Checkout</h1>
      <div className="button-group">
        <button onClick={() => handleNavigation("/scanner")}>📷 Start Scanning</button>
        <button onClick={() => handleNavigation("/cart")}>🛒 View Cart</button>
        <button onClick={() => handleNavigation("/checkout")}>💳 Checkout</button>
        <button onClick={() => handleNavigation("/login")}>🚪 Logout</button>
      </div>
    </div>
  );
};

export default Home;
