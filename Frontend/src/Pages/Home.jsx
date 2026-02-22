import Navbar from "../Sections/Navbar";
import HeroSection from "../Sections/HeroSection";
import Footer from "../Sections/Footer";
import AboutUs from "../Sections/AboutUs";
import OurInterest from "../Sections/OurInterest";
import SectionSeperator from "../Components/SectionSeperator";

function Home() {
  return (
    <div className="min-h-screen max-w-fit flex flex-col relative overflow-hidden">
      <Navbar />

      <HeroSection />

      <SectionSeperator />
      <AboutUs />

      <SectionSeperator />
      <OurInterest />

      <SectionSeperator />
      <Footer />
    </div>
  );
}

export default Home;
