import Layout from "../components/Layout.jsx";
import HeroSection from "./HeroSection.jsx";
import CalculatorSection from "./CalculatorSection.jsx";
import ContentSection from "./ContentSection.jsx";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col gap-6 px-6  lg:flex-row lg:items-center pt-40 lg:pt-52 lg:px-8">
        <HeroSection />
        <CalculatorSection />
      </div>
      <ContentSection />
    </>
  );
};

export default HomePage;
