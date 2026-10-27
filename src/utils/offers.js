// Works out how much a claimed offer takes off the cart, using the
// offer's own wording (e.g. "20% OFF", "Flat ₹50 OFF", "drinks from
// 4 PM to 7 PM", "burger + Cold Coffee", "first order").
//
// Returns { amount, message } -- amount is 0 when the offer doesn't
// apply yet, and message tells the customer why.

const lineTotal = (item) => Number(item.price || 0) * Number(item.quantity || 0);

function parseDiscount(discountText) {
  const percent = /(\d+(?:\.\d+)?)\s*%/.exec(discountText || "");
  if (percent) return { type: "percent", value: Number(percent[1]) };

  const flat = /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)/i.exec(discountText || "");
  if (flat) return { type: "flat", value: Number(flat[1]) };

  return null;
}

// "4 PM to 7 PM" -> [16, 19]
function parseHours(text) {
  const match = /(\d{1,2})\s*(am|pm)\s*(?:to|-|–)\s*(\d{1,2})\s*(am|pm)/i.exec(text);
  if (!match) return null;

  const to24 = (hour, meridiem) =>
    (Number(hour) % 12) + (meridiem.toLowerCase() === "pm" ? 12 : 0);

  return [to24(match[1], match[2]), to24(match[3], match[4])];
}

export function getOfferDiscount(offer, cart, previousOrderCount = 0) {
  if (!offer || cart.length === 0) return { amount: 0, message: "" };

  const discount = parseDiscount(offer.discount);
  if (!discount) {
    return { amount: 0, message: `${offer.title} can't be applied online.` };
  }

  const text = `${offer.title} ${offer.description}`.toLowerCase();
  let eligibleTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  if (text.includes("first order") && previousOrderCount > 0) {
    return {
      amount: 0,
      message: `${offer.title} is only for your first order.`,
    };
  }

  const hours = parseHours(text);
  if (hours) {
    const now = new Date().getHours();
    if (now < hours[0] || now >= hours[1]) {
      const label = (hour) =>
        `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;

      return {
        amount: 0,
        message: `${offer.title} is valid only from ${label(hours[0])} to ${label(hours[1])}.`,
      };
    }
  }

  if (text.includes("burger") && text.includes("coffee")) {
    const hasBurger = cart.some((item) => item.category === "Burger");
    const hasCoffee = cart.some((item) => /coffee/i.test(item.name));

    if (!hasBurger || !hasCoffee) {
      return {
        amount: 0,
        message: `Add a burger and a Cold Coffee to use ${offer.title}.`,
      };
    }
  } else if (text.includes("drink")) {
    eligibleTotal = cart
      .filter((item) => item.category === "Drink")
      .reduce((sum, item) => sum + lineTotal(item), 0);

    if (eligibleTotal === 0) {
      return {
        amount: 0,
        message: `Add a drink to use ${offer.title}.`,
      };
    }
  }

  const amount =
    discount.type === "percent"
      ? (eligibleTotal * discount.value) / 100
      : Math.min(discount.value, eligibleTotal);

  return {
    amount: +amount.toFixed(2),
    message: `${offer.title} applied 🎉`,
  };
}
