import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/booking.css";
import API_URL from "../api";

function Booking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    request: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.date ||
      !form.time ||
      !form.guests
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("foodbot-user")
    );

    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/booking/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: user.id,
            restaurant_id: 1,
            booking_date: form.date,
            booking_time: form.time,
            guests: parseInt(form.guests),
            special_request: form.request,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Table booked successfully!");

        setForm({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "",
          request: "",
        });
      } else {
        alert(data.error || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Server error.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="booking-page">
        <h1>Reserve Your Table</h1>

        <form
          className="booking-form"
          onSubmit={handleBooking}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />

          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={form.guests}
            onChange={handleChange}
          />

          <textarea
            rows="5"
            name="request"
            placeholder="Special Requests"
            value={form.request}
            onChange={handleChange}
          />

          <button type="submit">
            Book Now
          </button>
        </form>
      </div>
    </>
  );
}

export default Booking;