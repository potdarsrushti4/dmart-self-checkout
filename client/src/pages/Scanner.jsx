import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// JWT decoder
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const Scanner = () => {
  const [scannedData, setScannedData] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [scannerReady, setScannerReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const readerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const userId = decoded?.userId;

  // Ensure DOM is rendered first
  useEffect(() => {
    setScannerReady(true);
  }, []);

  // Start scanner only after DOM is ready
  useEffect(() => {
    if (!scannerReady || !readerRef.current) return;

    const html5QrCode = new Html5Qrcode(readerRef.current.id);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (decodedText !== scannedData) {
              setScannedData(decodedText);
              handleDetected(decodedText);
            }
          },
          (errorMsg) => {
            console.warn("Scan error", errorMsg);
          }
        );
      } else {
        setError("❌ No camera devices found");
      }
    }).catch(err => {
      console.error("Camera init error", err);
      setError("❌ Camera access error");
    });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        }).catch(err => {
          console.warn("Error stopping scanner", err);
        });
      }
    };
  }, [scannerReady]);

  const handleDetected = async (barcode) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/barcode/${barcode}`);
      setProduct(res.data);
      setError("");
    } catch (err) {
      setProduct(null);
      setError("❌ Product not found");
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId: product._id,
        quantity: 1
      });

      alert("Product added to cart 🛒");
      fetchCart(); // update cart count
    } catch (err) {
      alert("Failed to add to cart ❌");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  return (
    <div className="register-container">
      <h2>📷 Scan Product Barcode</h2>

      <div
        id="reader"
        ref={readerRef}
        style={{
          width: "300px",
          height: "300px",
          margin: "auto",
          backgroundColor: "#e0e0e0"
        }}
      ></div>

      {scannedData && <p><strong>Scanned Code:</strong> {scannedData}</p>}

      {product && (
        <div style={{ marginTop: '1rem' }}>
          <p>✅ Product Found</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Barcode:</strong> {product.barcode}</p>

          <button onClick={handleAddToCart} style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            Add to Cart
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Optional Enhancements */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            margin: "10px 0",
          }}
        >
          Go to Checkout 🧾
        </button>

        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            margin: "10px 0",
          }}
        >
          View Cart 🛒 {cartCount > 0 ? `(${cartCount})` : ""}
        </button>

        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            margin: "10px 0",
          }}
        >
          🏠 Go to Home
        </button>
      </div>

    </div>
  );
};

export default Scanner;
