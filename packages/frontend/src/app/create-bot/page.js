"use client"
import React, { useState } from "react";
import Header from "./components/Header";
import StepContent from "./components/StepContent";
import StepperControls from "./components/StepperControls";

const steps = [
  "Personal Information",
  "Integrations",
  "Wallet Integration",
  "Portfolio Configuration",
  "Trading Preferences",
  "Alerts & Notifications",
  "Confirmation",
];

const StepperForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    botName: "",
    tradingObjective: "",
    walletAddress: "",
    preferredTokens: "",
    marketSources: [],
    riskTolerance: "",
    regressionPatterns: false,
    notifications: false,
  });

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const handleSubmit = () => alert("Form submitted: " + JSON.stringify(formData));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckboxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  const handleMultiSelectChange = (e) => {
    const options = Array.from(e.target.options).filter((opt) => opt.selected).map((opt) => opt.value);
    setFormData({ ...formData, marketSources: options });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 shadow-2xl rounded-lg">
        <Header currentStep={currentStep} steps={steps} />
        <StepContent
          currentStep={currentStep}
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          handleMultiSelectChange={handleMultiSelectChange}
        />
        <StepperControls
          currentStep={currentStep}
          steps={steps}
          handleBack={handleBack}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default StepperForm;
