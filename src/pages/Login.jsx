import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_URL from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "foodbot-user",
          JSON.stringify(result)
        );

        alert("Login Successful!");

        navigate("/");
      } else {
        alert(result.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to backend.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🍽 FoodBot</h1>

        <h2>Welcome Back</h2>

        <p>Login to continue ordering delicious food.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="bottom-text">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;