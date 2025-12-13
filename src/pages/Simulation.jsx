import React from 'react';
import MatrixDisplay from "../components/MatrixDisplay.jsx";
import StepController from "../components/StepController.jsx";
function Simulation(props) {
  return (
    <div className="flex flex-col">
    <StepController/>
    <MatrixDisplay/>
    </div>
  );
}

export default Simulation;