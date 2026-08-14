import { createContext, useEffect, useState } from "react";
import API_URL from "../api";

export const CartContext = createContext();

const API = `${API_URL}/api`;

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [itemsTotal, setItemsTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("foodbot-user"));
  const customerId = user?.id;

  // -------------------------
  // Load Cart
  // -------------------------
  const loadCart = async () => {
    if (!customerId) return;

    try {
      const res = await fetch(
        `${API}/cart/view/?customer_id=${customerId}`
      );

      if (!res.ok) {
        throw new Error(`Failed to load cart: ${res.status}`);
      }

      const data = await res.json();
      const items = data.cart?.items || [];

      setCart(items);

      const subtotal = Number(data.total_price || 0);
      setItemsTotal(subtotal);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  useEffect(() => {
    if (customerId) {
      loadCart();
    }
  }, [customerId]);

  // -------------------------
// Add Item
// -------------------------
const addToCart = async (item) => {
  if (!customerId) {
    console.error("No logged-in customer found.");
    return;
  }

  // Convert selected options into a readable string
  const customization = [
    ...(item.selectedOptions || []).map(
      (opt) => `${opt.category}: ${opt.option}`
    ),
    item.notes ? `Special Instructions: ${item.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch(`${API}/cart/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerId,
        menu_item_id: item.id,
        quantity: 1,
        customization,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to add item: ${res.status}`);
    }

    await loadCart();
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};
  // -------------------------
  // Increase Quantity
  // -------------------------
  const increaseQuantity = async (id) => {
    const item = cart.find((i) => i.id === id);

    if (!item) return;

    try {
      const res = await fetch(`${API}/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          cart_item_id: item.id,
          quantity: item.quantity + 1,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update cart: ${res.status}`);
      }

      await loadCart();
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  // -------------------------
  // Decrease Quantity
  // -------------------------
  const decreaseQuantity = async (id) => {
    const item = cart.find((i) => i.id === id);

    if (!item) return;

    if (item.quantity <= 1) {
      await removeFromCart(id);
      return;
    }

    try {
      const res = await fetch(`${API}/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          cart_item_id: item.id,
          quantity: item.quantity - 1,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update cart: ${res.status}`);
      }

      await loadCart();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  // -------------------------
  // Remove Item
  // -------------------------
  const removeFromCart = async (id) => {
    const item = cart.find((i) => i.id === id);

    if (!item) return;

    try {
      const res = await fetch(`${API}/cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          cart_item_id: item.id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to remove item: ${res.status}`);
      }

      await loadCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // -------------------------
  // Clear Cart
  // -------------------------
  const clearCart = async () => {
    if (!customerId) return;

    try {
      const res = await fetch(`${API}/cart/clear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to clear cart: ${res.status}`);
      }

      setCart([]);
      setItemsTotal(0);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // -------------------------
  // Totals
  // -------------------------
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const gst = +(itemsTotal * 0.05).toFixed(2);

  const deliveryFee = itemsTotal > 0 ? 40 : 0;

  const grandTotal =
    Number(itemsTotal) +
    Number(gst) +
    Number(deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        itemsTotal,
        gst,
        deliveryFee,
        grandTotal,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;