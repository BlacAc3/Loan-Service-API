// import { useState } from "react";
import "./App.css";
import { Navbar } from "./Layout";
import { CalculatorSection, HeroSection, ContentSection } from "./Home";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CalculatorSection />
      <ContentSection />
    </>
  );
}

export default App;
