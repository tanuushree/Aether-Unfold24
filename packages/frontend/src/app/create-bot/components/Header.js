import React from "react";

const Header = ({ currentStep, steps }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Trading Bot Setup</h1>
      <p className="text-gray-600 mt-2">
        Step {currentStep + 1} of {steps.length}: <span className="font-semibold">{steps[currentStep]}</span>
      </p>
    </header>
  );
};

export default Header;
