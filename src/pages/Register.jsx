import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API_URL from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    dietaryPreferences: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/register/customer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      console.log("Backend Response:", result);

      if (response.ok) {
        alert("✅ Registration Successful!");
        navigate("/login");
      } else {
        let errorMessage = "";

        if (typeof result === "object") {
          for (const key in result) {
            errorMessage += `${key}: ${result[key]}\n`;
          }
        } else {
          errorMessage = result;
        }

        alert(errorMessage || "Registration Failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Cannot connect to Django backend.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🍽 FoodBot</h1>

        <h2>Create Account</h2>

        <p>
          Join FoodBot and start ordering your favourite meals.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="dietary-section">
            <label>Dietary Preference</label>

            <div className="dietary-options">
              {["Vegetarian", "Non-Vegetarian"].map(
                (option) => (
                  <label
                    key={option}
                    className="dietary-checkbox"
                  >
                    <input
                      type="radio"
                      name="dietaryPreference"
                      checked={formData.dietaryPreferences.includes(
                        option
                      )}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          dietaryPreferences: [option],
                        })
                      }
                    />

                    {option}
                  </label>
                )
              )}
            </div>
          </div>

          <button type="submit">
            Register
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;