import { useState } from "react";
import axios from "axios";
import './Register.css'; //using the same css as register page
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Install if needed: npm i react-icons
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      alert("Login successful 🎉");
      navigate("/home"); // 👈 Redirect here
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="register-container"> {/* same class as Register */}
      <img src="/dmart_logo.png" alt="DMart Logo" style={{ width: '150px', display: 'block', margin: '0 auto' }} />
      <h2>Login</h2>
      <form className="register-form" onSubmit={handleSubmit}> {/* same class */}
        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ paddingRight: "2.5rem" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#2e7d32"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p style={{ textAlign: 'right', fontSize: '0.9rem', marginTop: '-10px', marginBottom: '10px' }}>
          <a href="#">Forgot Password?</a>
        </p>

        <button type="submit">Login</button>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          New user? <a href="/register">Register here</a>
        </p>

      </form>
    </div>
  );
};

export default Login;
