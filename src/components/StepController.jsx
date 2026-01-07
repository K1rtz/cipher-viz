import React, {useState} from 'react';
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
} from './../store/selectors/stepInfoSelector.js'
import { setActiveStep, setPlainText, setRowKey, setColumnKey, setRowsSubsteps, setRowsCurrentStep, setRowsAdvanceNext, setColumnsCurrentStep, setColumnsSubsteps, setColumnsAdvanceNext} from './../store/reducers/stepInfoReducer'
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

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
        'Provide a numerical key that defines how the rows of the matrix will be rearranged. ' +
        'Each digit in the key represents the new position of a row, allowing you to observe step-by-step how row permutations affect the structure of the message.',
      keyText: 'Key:'
    },
    {
      id: 3,
      title: 'Column Permutation',
      description:
        'Provide a numerical key that determines the reordering of the matrix columns. ' +
        'After rows have been permuted, the same principle is applied to columns, further obscuring the original message and increasing the security of the cipher.',
      keyText: 'Key:'
    },
    {
      id: 4,
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

  const currentStep = useSelector(selectActiveStep)
  const plainText = useSelector(selectPlainText)
  const rowKey = useSelector(selectRowKey)
  const columnKey = useSelector(selectColumnKey)





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

  const handleGenerateRowSubsteps = () =>{

    if(rowKey.length !== matrixRowsLen){
      setShowRowsKeyError(true)
      return
    }
    if(showRowsKeyError){
      setShowRowsKeyError(false);
    }

  if(!rowKey || rowKey.length === 0) return
    const substeps = generateSubsteps(rowKey)

    console.log(substeps);
    dispatch(setRowsSubsteps(substeps))
    dispatch(setRowsCurrentStep(0))
    dispatch(setRowsAdvanceNext(true))
  }

  const [showColsKeyError, setShowColsKeyError] = useState(false)
  const [showRowsKeyError, setShowRowsKeyError] = useState(false)
  const [showPlainTextError, setShowPlainTextError] = useState(false)

  const handleGenerateColumnSubsteps = () =>{
    if(columnKey.length !== matrixColsLen){
      console.log('xdd nisu iste duzine')
      setShowColsKeyError(true)
      return
    }
    if(showColsKeyError){
      setShowColsKeyError(false);
    }
    if(!columnKey || columnKey.length === 0) return
    const substeps = generateSubsteps(columnKey)

    dispatch(setColumnsSubsteps(substeps))
    dispatch(setColumnsCurrentStep(0))
    dispatch(setColumnsAdvanceNext(true))
  }



  const handlePrevious = () => {
    if (currentStep > 0)
      dispatch(setActiveStep(currentStep - 1))
    console.log(currentStep)
    if(currentStep === 2) {
      dispatch(setColumnsCurrentStep(0))
      dispatch(setColumnsAdvanceNext(true))
    }
    if(currentStep === 1){
      dispatch(setRowsCurrentStep(0))
      dispatch(setRowsAdvanceNext(true))
    }
  };


  const handleNext = () => { //TODO big fixes 07.01.2026
    if(currentStep === 0 && plainText.length === 0){
      setShowPlainTextError(true);
      return
    }
    if(currentStep === 1 && rowKey.length !== matrixRowsLen){
      setShowRowsKeyError(true)
      return
    }
    if(currentStep === 2 && columnKey.length !== matrixColsLen){
      setShowColsKeyError(true)
      return
    }

    if(currentStep === 1){
      if(rowsCurrentStep !== rowsSubsteps.length-1) {
        dispatch(setRowsCurrentStep(rowsSubsteps.length - 1))
        dispatch(setRowsAdvanceNext(true))
      }
      // }

       // }
    }
    if(currentStep === 2){
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

    if (currentStep < steps.length - 1)
    dispatch(setActiveStep(currentStep + 1))
  };

  return (
    <div className='px-6 pt-6 '>
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
      <div className={`flex items-start gap-2 mt-4 ${currentStep === 0 ? 'flex' : 'hidden'}`}>

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

        <button
          className="px-3 text-sm py-[4px] rounded bg-blue-600 text-white hover:bg-blue-500"
          //onClick={}
        >
          Confirm
        </button>
      </div>

      <div
        className={`flex items-start gap-2 mt-4 ${
          currentStep === 1 ? 'flex' : 'hidden'
        }`}
      >

        <div className="flex-1">
          <input
            type="text"
            maxLength={matrixRowsLen}
            value={rowKey}
            onChange={(e) => {
              dispatch(setRowKey(e.target.value))
            }}
            className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm"
          />

          {/* ERROR TEXT */}
          {showRowsKeyError && (
            <p className="mt-1 text-xs text-red-400">
              Rows key must be exactly {matrixRowsLen} characters long.
            </p>
          )}
        </div>



        <button
          className="px-3 text-sm py-[4px] rounded bg-blue-600 text-white hover:bg-blue-500"
          onClick={handleGenerateRowSubsteps}
        >
          Confirm
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep !== 0) {
              dispatch(setRowsCurrentStep(0))
              dispatch(setRowsAdvanceNext(true))

            }

          }}
        >
          <TbPlayerTrackPrevFilled />
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep > 0) {
              dispatch(setRowsCurrentStep(rowsCurrentStep - 1))
              dispatch(setRowsAdvanceNext(true))

            }
          }}>
          <BiSolidLeftArrow/>
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep < rowsSubsteps.length-1) {
              dispatch(setRowsCurrentStep(rowsCurrentStep + 1))
              dispatch(setRowsAdvanceNext(true))
            }
          }}>
          <BiSolidRightArrow />
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log(rowsCurrentStep);
            if(rowsCurrentStep < rowsSubsteps.length) {
              dispatch(setRowsCurrentStep(rowsSubsteps.length -1))
              dispatch(setRowsAdvanceNext(true))
            }
          }}
        >
          <TbPlayerTrackNextFilled />
        </button>
      </div>
      <div
        className={`flex items-start gap-2 mt-4 ${
          currentStep === 2 ? 'flex' : 'hidden'
        }`}
      >
        {/* INPUT + ERROR */}
        <div className="flex-1">
          <input
            type="text"
            maxLength={matrixColsLen}
            value={columnKey}
            onChange={(e) => {
              dispatch(setColumnKey(e.target.value))
            }}
            className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm"
          />

          {/* ERROR TEXT */}
          {showColsKeyError && (
            <p className="mt-1 text-xs text-red-400">
              Column key must be exactly {matrixColsLen} characters long.
            </p>
          )}
        </div>

        <button
          className="px-3 text-sm py-[4px] rounded bg-blue-600 text-white hover:bg-blue-500"
          onClick={handleGenerateColumnSubsteps}
        >
          Confirm
        </button>
        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            if(columnsCurrentStep !== 0) {
              dispatch(setColumnsCurrentStep(0))
              dispatch(setColumnsAdvanceNext(true))

            }

          }}
        >
          <TbPlayerTrackPrevFilled />
        </button>

        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            if(columnsCurrentStep > 0) {
              dispatch(setColumnsCurrentStep(columnsCurrentStep - 1))
              dispatch(setColumnsAdvanceNext(true))

            }
          }}>
          <BiSolidLeftArrow/>
        </button>

        <button
          className="px-2 py-[6px] rounded   bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            console.log('columnsCurrentStep:' + columnsCurrentStep)
            console.log('columnsSubsteps:' + columnsSubsteps)

            if(columnsCurrentStep < columnsSubsteps.length-1) {
              dispatch(setColumnsCurrentStep(columnsCurrentStep + 1))
              console.log('doslosepredulazD:')
              dispatch(setColumnsAdvanceNext(true))
            }
          }}>
          <BiSolidRightArrow />

        </button>

        <button
          className="px-2 py-[6px] rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() =>{
            if(columnsCurrentStep < columnsSubsteps.length) {
              dispatch(setColumnsCurrentStep(columnsSubsteps.length -1))
              dispatch(setColumnsAdvanceNext(true))
            }
          }}
        >
          <TbPlayerTrackNextFilled />
        </button>
        {/* ... dugmići ostaju isti */}
      </div>

    </div>
    </div>
  );
}
