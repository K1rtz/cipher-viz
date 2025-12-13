import React, {useState} from 'react';

export default function StepController() {
  const steps = [
    { id: 1, title: 'Fill Grid', description: 'Text is placed into a grid, filled with the chosen filler.' },
    { id: 2, title: 'First Transposition', description: 'Rows are reordered based on the first password.' },
    { id: 3, title: 'Second Transposition', description: 'Columns are reordered based on the second password.' },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className='px-6 pt-6'>
    <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
          Step {steps[currentStep].id} of {steps.length}: {steps[currentStep].title}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentStep === steps.length - 1
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{steps[currentStep].description}</p>
    </div>
    </div>
  );
}
