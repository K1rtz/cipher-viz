import React, {useEffect, useMemo, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  selectActiveStep,
  selectColumnKey,
  selectPlainText,
  selectRowKey,
  selectNextSubstepSignal,
  selectRowsCurrentStep,
  selectRowsSubsteps,
  selectColumnsCurrentStep,
  selectColumnsSubsteps,
  selectMatrixColsLen,
  selectMatrixRowsLen,
  selectStepChange, selectCurrentStep,
} from './../store/selectors/stepInfoSelector.js'
import { setActiveStep, setPlainText, setRowKey, setColumnKey, setStepChange, setCurrentStep, setKeyRaw, setRowsSubsteps, setRowsCurrentStep, setRowsAdvanceNext, setColumnsCurrentStep, setColumnsSubsteps, setColumnsAdvanceNext} from './../store/reducers/stepInfoReducer'
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
// import { TbPlayerTrackPrevFilled } from "react-icons/tb";
// import { TbPlayerTrackNextFilled } from "react-icons/tb";

export default function StepController() {
  const steps = [
    {
      id: 1,
      title: 'Input Text',
      description:
        'Enter the original message that will be encrypted using the Double Transposition cipher. ' +
        'This text will be placed sequentially into the matrix row by row and serves as the starting point of the encryption process.',
      keyText: 'Message:'
    },
    {
      id: 2,
      title: 'Row Permutation',
      description:
        'Provide a numerical key that defines how the rows of the matrix will be rearranged.',
      keyText: 'Key:'
    },
    {
      id: 3,
      title: 'Encrypted Output',
      description:
        'This step displays the final encrypted message obtained after completing both row and column transpositions. ' +
        'The resulting ciphertext illustrates how double transposition significantly changes the original text while preserving all characters.',
      keyText: ''
    }
  ];

  const dispatch = useDispatch()
  const rowsCurrentStep = useSelector(selectRowsCurrentStep)
  const rowsSubsteps = useSelector(selectRowsSubsteps)
  const columnsCurrentStep = useSelector(selectColumnsCurrentStep)
  const columnsSubsteps = useSelector(selectColumnsSubsteps)
  const matrixColsLen = useSelector(selectMatrixColsLen)
  const matrixRowsLen = useSelector(selectMatrixRowsLen)
  const maxLen = matrixColsLen * matrixRowsLen;
  const currentStep = useSelector(selectCurrentStep)

  const stepChange = useSelector(selectStepChange)

  const activeStep = useSelector(selectActiveStep)
  const plainText = useSelector(selectPlainText)
  const rowKey = useSelector(selectRowKey)
  const columnKey = useSelector(selectColumnKey)

  const [raw, setRaw] = useState('');
  const [formatted, setFormatted] = useState('');



  const formatAsPairs = (digits) => {
    if (!digits) return '';

    const pairs = [];
    for (let i = 0; i < digits.length; i += 2) {
      const first = digits[i];
      const second = digits[i + 1];

      if (second !== undefined) {
        pairs.push(`(${first}-${second})`);
      } else {
        pairs.push(`(${first}-`);
      }
    }

    return pairs.join(',');
  };


  function keyToNumberArray(key) {
    const chars = key.split('');

    const indexedChars = chars.map((char, idx) => ({ char, idx }));

    const sorted = [...indexedChars].sort((a, b) => {
      if (a.char < b.char) return -1;
      if (a.char > b.char) return 1;
      return a.idx - b.idx;
    });

    const orderMap = new Array(key.length);
    sorted.forEach((item, i) => {
      orderMap[item.idx] = i;
    });

    return orderMap;
  }

  function generateSubsteps(key) {
    console.log(key)
    const n = key.length;
    console.log(keyToNumberArray(key))
    // const target = key.split('').map(Number);
    const target = keyToNumberArray(key)
    console.log(target)
    const steps = [];

    const current = Array.from({ length: n }, (_, i) => i);
    steps.push([...current]);

    for (let i = 0; i < n; i++) {
      if (current[i] !== target[i]) {
        const swapIndex = current.indexOf(target[i]);
        [current[i], current[swapIndex]] = [current[swapIndex], current[i]];
        steps.push([...current]);
      }
    }

    return steps;
  }

  const [keyDisplay, setKeyDisplay] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lastMove, setLastMove] = useState(false);
  useEffect(() => {
    dispatch(setCurrentStep(activeIndex))
  },[activeIndex])

  const pairs = useMemo(() => {
    const result = [];

    for (let i = 0; i < raw.length; i += 2) {
      const a = raw[i];
      const b = raw[i + 1];

      if (b !== undefined) {
        result.push(`(${a}-${b})`);
      }
    }

    return result;
  }, [raw]);

  const handleKeyConfirm = () =>{

    if(raw.length % 2 === 1){
      setShowRowsKeyError(true)
      return;
    }
    if(showRowsKeyError === true){
      setShowRowsKeyError(false);
    }
    setFormatted(formatAsPairs(raw));
    setKeyDisplay(true);

    dispatch(setKeyRaw(raw))
  }


  // const handleGenerateRowSubsteps = () =>{
  //
  //   if(rowKey.length !== matrixRowsLen){
  //     setShowRowsKeyError(true)
  //     return
  //   }
  //   if(showRowsKeyError){
  //     setShowRowsKeyError(false);
  //   }
  //
  // if(!rowKey || rowKey.length === 0) return
  //   const substeps = generateSubsteps(rowKey)
  //
  //   console.log(substeps);
  //   dispatch(setRowsSubsteps(substeps))
  //   dispatch(setRowsCurrentStep(0))
  //   dispatch(setRowsAdvanceNext(true))
  // }

  const [showColsKeyError, setShowColsKeyError] = useState(false)
  const [showRowsKeyError, setShowRowsKeyError] = useState(false)
  const [showPlainTextError, setShowPlainTextError] = useState(false)

  // const handleGenerateColumnSubsteps = () =>{
  //   if(columnKey.length !== matrixColsLen){
  //     console.log('xdd nisu iste duzine')
  //     setShowColsKeyError(true)
  //     return
  //   }
  //   if(showColsKeyError){
  //     setShowColsKeyError(false);
  //   }
  //   if(!columnKey || columnKey.length === 0) return
  //   const substeps = generateSubsteps(columnKey)
  //
  //   dispatch(setColumnsSubsteps(substeps))
  //   dispatch(setColumnsCurrentStep(0))
  //   dispatch(setColumnsAdvanceNext(true))
  // }



  const handlePrevious = () => {
    if (activeStep > 0)
      dispatch(setActiveStep(activeStep - 1))
    console.log(activeStep)
    if(activeStep === 2) {
      dispatch(setColumnsCurrentStep(0))
      dispatch(setColumnsAdvanceNext(true))
    }
    if(activeStep === 1){
      dispatch(setRowsCurrentStep(0))
      dispatch(setRowsAdvanceNext(true))
    }
  };


  const handleNext = () => { //TODO big fixes 07.01.2026
    if(activeStep === 0 && plainText.length === 0){
      setShowPlainTextError(true);
      return
    }
    if(activeStep === 1 && rowKey.length !== matrixRowsLen){
      setShowRowsKeyError(true)
      return
    }
    if(activeStep === 2 && columnKey.length !== matrixColsLen){
      setShowColsKeyError(true)
      return
    }

    if(activeStep === 1){
      if(rowsCurrentStep !== rowsSubsteps.length-1) {
        dispatch(setRowsCurrentStep(rowsSubsteps.length - 1))
        dispatch(setRowsAdvanceNext(true))
      }
      // }

       // }
    }
    if(activeStep === 2){
      if(columnsCurrentStep !== columnsSubsteps.length-1){
        dispatch(setColumnsCurrentStep(columnsSubsteps.length -1))
        dispatch(setColumnsAdvanceNext(true))
      }
    }
    if(showColsKeyError){
      setShowColsKeyError(false)
    }
    if(showPlainTextError){
      setShowPlainTextError(false);
    }
    if(showRowsKeyError){
      setShowRowsKeyError(false)
    }

    if (activeStep < steps.length - 1)
    dispatch(setActiveStep(activeStep + 1))
  };

  const [direction, setDirection] = useState(true);

  useEffect(() => {
    console.log('raw:', raw);
    console.log('formatted:', formatAsPairs(raw));
  }, [raw]);

  return (
    <div className='px-6 pt-6 '>
    <div className="bg-gray-900/80 min-h-[170px] backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
         {steps[activeStep].title}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeStep === 0
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeStep === steps.length - 1
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{steps[activeStep].description}</p>
      <div className={`flex items-start gap-2 mt-4 ${activeStep === 0 ? 'flex' : 'hidden'}`}>

        <div className="relative flex-1">
          <div className='flex-1'>
            <div className="relative flex-1">

            <input
            type="text"
            maxLength={maxLen}
            value={plainText}
            onChange={(e) =>
              dispatch(setPlainText(e.target.value.toUpperCase().replace(/\s+/g, '')))
            }
            className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 pr-14 text-sm"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {plainText.length}/{maxLen}
          </span>
            </div>
            {showPlainTextError && (
              <p className="mt-1 text-xs text-red-400">
                Message field is empty!
              </p>
            )}

          </div>

        </div>

      </div>

      {/*//GLAVNI STEP*/}
      <div
        className={`flex items-start gap-2 mt-4 ${
          activeStep === 1 ? 'flex' : 'hidden'
        }`}
      >

        <div className="flex-1">
          {

            keyDisplay ?

              <div className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm flex flex-wrap gap-1">

                {pairs.map((pair, i) => (
                  <span
                    key={i}
                    className={`
                    rounded-[2px] px-1
                    ${i === currentStep
                      ? ' text-blue-500 bg-blue-500/10'
                      : 'text-gray-300'}
                    `}
                  >
                    {pair}
                    {i < pairs.length - 1 && ''}
                </span>
                ))}
              </div>
            :
          <input
            type="text"
            value={formatAsPairs(raw)}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
              setRaw(digitsOnly);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault(); // sprečava default brisanje formatiranog teksta
                setRaw((prev) => prev.slice(0, -1));
              }
            }}
            className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm"
          />

          }
          {/* ERROR TEXT */}
          {showRowsKeyError && (
            <p className="mt-1 text-xs text-red-400">
              Key values must be in pairs.
            </p>
          )}
        </div>



        <button
          className="px-3 text-sm py-[4px] rounded bg-blue-600 text-white hover:bg-blue-500"
          onClick={handleKeyConfirm}//TODO nema vise generate substeps sad se substepovi unose rucno
        >
          Confirm
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          disabled = {currentStep <= -1}
          onClick={() =>{
            dispatch(setCurrentStep(currentStep - 1))
            // if(direction === false) {
            //
            //   setActiveIndex((i) => Math.max(i - 1, 0));
            //   console.log(activeIndex);
            //   dispatch(setCurrentStep(activeIndex));
            //   dispatch(setStepChange(!stepChange))
            // }
            // else {
            //   dispatch(setStepChange(!stepChange));
            // }
            // setDirection(false);
          }}>
          <BiSolidLeftArrow/>
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          disabled = {currentStep >= pairs.length - 1}
          onClick={() =>{
            dispatch(setCurrentStep(currentStep + 1))
            console.log('right' + activeIndex)
          //   if(direction === true) {
          //
          //     setActiveIndex((i) => Math.min(i + 1, pairs.length - 1))
          //     console.log(activeIndex)
          //     dispatch(setCurrentStep(activeIndex));
          //     dispatch(setStepChange(!stepChange))
          //   }
          //   else {
          //     dispatch(setStepChange(!stepChange))
          //   }
          //   setDirection(true)
          }}>
          <BiSolidRightArrow />
        </button>
      </div>


    </div>
    </div>
  );
}
