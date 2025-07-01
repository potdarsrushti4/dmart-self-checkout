import { useState } from "react";
import axios from "axios";
import './Register.css';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/.test(formData.email.trim())) {
      newErrors.email = "Only Gmail or Yahoo emails are allowed";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, number & special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // redirect after 2 seconds
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="register-container">
      <img src="/dmart_logo.png" alt="DMart Logo" style={{ width: '150px', margin: '0 auto', display: 'block' }} />
      <h2>Register</h2>

      {success && <p className="success-message">✅ Registered successfully!</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email.trim()}
          onChange={handleChange}
          required
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}

        <div className="password-wrapper" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

        <button type="submit">Register</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
