import "../styles/DownloadApp.css";
import { FaGooglePlay, FaApple } from "react-icons/fa";

function DownloadApp() {
  return (
    <section className="download-app">

      <div className="download-left">

        <h2>Download FoodBot App</h2>

        <p>
          Order your favourite food anytime, anywhere.
          Get exclusive discounts, faster checkout,
          live order tracking and much more.
        </p>

        <div className="store-buttons">

          <button>
            <FaGooglePlay />
            Google Play
          </button>

          <button>
            <FaApple />
            App Store
          </button>

        </div>

      </div>

      <div className="download-right">

        <img
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9?w=500"
          alt="Mobile App"
        />

      </div>

    </section>
  );
}

export default DownloadApp;