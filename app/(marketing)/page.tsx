import Hero from "@/components/general/Hero";
import Header from "@/components/header";
import Technolgies from "@/components/general/Technolgies";
import React from "react";
import Features from "@/components/general/Features";
import FAQs from "@/components/general/FAQs";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Technolgies />
      <Features />
      <FAQs />
    </div>
  );
};

export default HomePage;
