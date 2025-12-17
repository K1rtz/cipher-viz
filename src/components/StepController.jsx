import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  selectActiveStep,
  selectColumnKey,
  selectPlainText,
  selectRowKey,
  selectNextSubstepSignal,
  selectRowsCurrentStep,
  selectRowsSubsteps
} from './../store/selectors/stepInfoSelector.js'
import { setActiveStep, setPlainText, setRowKey, setColumnKey, setNextSubstepSignal, setRowsSubsteps, setRowsCurrentStep} from './../store/reducers/stepInfoReducer'
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

export default function StepController() {
  const steps = [
    {
      id: 1,
      title: 'Unos poruke',
      description: 'Unesite tekst koji će biti šifrovan korišćenjem metode dvostruke transpozicije.',
      keyText: 'Poruka:'
    },
    {
      id: 2,
      title: 'Permutacije redova',
      description: 'Unesite ključ na osnovu kog će se izvršiti permutacija redova matrice.',
      keyText: 'Ključ:'
    },
    {
      id: 3,
      title: 'Permutacije kolona',
      description: 'Unesite ključ na osnovu kog će se izvršiti permutacija kolona matrice.',
      keyText: 'Ključ:'
    },
    {
      id: 4,
      title: 'Šifrovana poruka',
      description: 'Prikaz konačne šifrovane poruke dobijene nakon obe transpozicije.',
      keyText: ''
    }
  ];
  const dispatch = useDispatch()
  const rowsCurrentStep = useSelector(selectRowsCurrentStep)
  const rowsSubsteps = useSelector(selectRowsSubsteps)

  const currentStep = useSelector(selectActiveStep)
  const plainText = useSelector(selectPlainText)
  const rowKey = useSelector(selectRowKey)
  const columnKey = useSelector(selectColumnKey)
  const nextSubstepSignal = useSelector(selectNextSubstepSignal)

  const handlePrevious = () => {
    if (currentStep > 0)
      dispatch(setActiveStep(currentStep - 1))

  };

  function generateSubsteps(key) {
    const n = key.length;
    const target = key.split('').map(Number);
    const steps = [];

    // Inicijalni korak
    const current = Array.from({ length: n }, (_, i) => i);
    steps.push([...current]);

    for (let i = 0; i < n; i++) {
      if (current[i] !== target[i]) {
        // Nađi gde je ciljna kolona i swapuj
        const swapIndex = current.indexOf(target[i]);
        [current[i], current[swapIndex]] = [current[swapIndex], current[i]];
        steps.push([...current]);
      }
    }

    return steps;
  }

  const handleGenerateRowSubsteps = () =>{
  if(!rowKey || rowKey.length === 0) return
    const substeps = generateSubsteps(rowKey)

    console.log(substeps);
    dispatch(setRowsSubsteps(substeps))
    dispatch(setRowsCurrentStep(0))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1)
    dispatch(setActiveStep(currentStep + 1))
  };

  return (
    <div className='px-6 pt-6 '
         // onClick={() => dispatch(setNextSubstepSignal(!nextSubstepSignal))}
    >
    <div className="bg-gray-900/80 min-h-[170px] backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
         {steps[currentStep].title}
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
      {/*<p className='text-gray-300 mt-4 text-sm py-1'>{steps[currentStep].keyText}</p>*/}
      <input type='text'
             maxLength={49}
             value={plainText}
             onChange={(e) => dispatch(setPlainText(e.target.value.toUpperCase())) }
             className={`text-gray-300 bg-gray-700/50 w-full uppercase mt-2  ${currentStep === 0 ? 'flex' : 'hidden'} rounded-[4px] px-2 py-1 text-sm leading-relaxed `}></input>
      <input type='text'
             maxLength={7}
             value={rowKey}
             onChange={(e) => dispatch(setRowKey(e.target.value))}
             className={`text-gray-300 bg-gray-700/50 w-full uppercase mt-2 ${currentStep === 1 ? 'flex' : 'hidden'} rounded-[4px] px-2 py-1 text-sm leading-relaxed `}></input>
      <div
        className={`flex items-center gap-2 mt-2 ${
          currentStep === 1 ? 'flex' : 'hidden'
        }`}
      >
        {/* ⏮ Start */}
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep !== 0) {
              dispatch(setRowsCurrentStep(0))
              dispatch(setNextSubstepSignal(!nextSubstepSignal))
            }
          }}
        >
          <TbPlayerTrackPrevFilled />
        </button>

        {/* ◀ Previous */}
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep > 0) {
              dispatch(setRowsCurrentStep(rowsCurrentStep - 1))
              dispatch(setNextSubstepSignal(!nextSubstepSignal))
            }
          }}>
          <BiSolidLeftArrow/>
        </button>

        {/* ▶ Next */}
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep < rowsSubsteps.length-1) {
              dispatch(setRowsCurrentStep(rowsCurrentStep + 1))
              dispatch(setNextSubstepSignal(!nextSubstepSignal))
            }
          }}>
          <BiSolidRightArrow />

        </button>

        {/* ⏭ End */}
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep < rowsSubsteps.length) {
              dispatch(setRowsCurrentStep(rowsSubsteps.length -1))
              dispatch(setNextSubstepSignal(!nextSubstepSignal))
            }
          }}
        >
          <TbPlayerTrackNextFilled />
        </button>

        {/* Input */}
        <input
          type="text"
          maxLength={7}
          value={rowKey}
          onChange={(e) => dispatch(setRowKey(e.target.value))}
          className="flex-1 text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm"
        />

        {/* Confirm */}
        <button
          className="px-3 py-[2px] rounded bg-blue-600 text-white hover:bg-blue-500"
          onClick={handleGenerateRowSubsteps}
        >
          Confirm
        </button>
      </div>

      <input type='text'
             maxLength={7}
             value={columnKey}
             onChange={(e) => dispatch(setColumnKey(e.target.value))}
             className={`text-gray-300 bg-gray-700/50 w-full uppercase  mt-2 ${currentStep === 2 ? 'flex' : 'hidden'} rounded-[4px] px-2 py-1 text-sm leading-relaxed `}></input>
    </div>
    </div>
  );
}
