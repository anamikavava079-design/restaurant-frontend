import DownloadApp from "../components/DownloadApp";
import Stats from "../components/Stats";
import SpecialOffers from "../components/SpecialOffers";
import Testimonials from "../components/Testimonials";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import PopularFoods from "../components/PopularFoods";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <PopularFoods />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
      <SpecialOffers />
      <Stats />
      <DownloadApp />
    </>
  );
}

export default Home;
