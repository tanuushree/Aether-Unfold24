import React from "react";

const StepperControls = ({ currentStep, steps, handleBack, handleNext, handleSubmit }) => {
  return (
    <div className="flex justify-between mt-6 gap-10">
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="px-4 w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
      )}
      {currentStep < steps.length - 1 ? (
        <button
          onClick={handleNext}
          className="px-4 w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Next
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 w-full bg-green-600 text-white rounded-lg hover:bg-green-500"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default StepperControls;
