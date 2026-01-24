import React, {useEffect, useMemo, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion';
import { FiCopy } from 'react-icons/fi';
import {
  selectActiveStep,
  selectPlainText,
  selectMatrixColsLen,
  selectMatrixRowsLen,
  selectCurrentStep,
  selectHighlightStep,
  selectFakeColsLen,
  selectCipherType,
  selectVisualStep,
  selectEngineSteps,
  selectCurrentMatrixValue,
  selectKeyRaw,
} from './../store/selectors/stepInfoSelector.js'
import { setVisualStep, setActiveStep, setPlainText, setHighlightStep, setCurrentStep, setKeyRaw, setHexText, setColsLen, setRowsLen, setFakeColsLen, setCipherType, setEngineSteps} from './../store/reducers/stepInfoReducer'
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { div } from 'framer-motion/client';

export default function StepController() {
  const steps = [
    {
      id: 1,
      title: '1. Encryption setup',
      description: 'Enter the original message to be encrypted, select the encryption algorithm (e.g., Chained XOR, Shifting XOR, Classic Double Transposition), and configure the matrix dimensions. ' + 'This step serves as the initial configuration for the encryption process, combining message input with algorithm choice and matrix setup.',
      keyText: 'Message:',
    },
    {
      id: 2,
      title: '2. Transposition key and steps in encryption simulation',
      description:
        'Enter a key with an even number of digits.  \n' +
        '  Then simulate the transposition step by step using the left/right arrows.\n' + 'Highlighted pair represents previous swap.',
      keyText: 'Key:'
      
    },
    {
      id: 3,
      title: '3. Encrypted Output',
      description:
        'This step displays the final encrypted message obtained after completing both row and column transpositions. ' +
        'The resulting ciphertext illustrates how double transposition significantly changes the original text while preserving all characters.',
      keyText: ''
    },
    {
      id: 4,
      title: '4. Transposition key and steps in decryption simulation',
      description:'Now decrypt the message step by step by applying the key in reverse order. Use the arrows to simulate each decryption step.',
      keyText: ''
    },
    {
      id: 5,
      title: '5. Decryption Output',
      description:'This step displays the final decrypted message, which should match the original input after successful decryption.',
      keyText: ''
    },
    
  ];

  const keyRaw = useSelector(selectKeyRaw)
  const currentMatrixValue = useSelector(selectCurrentMatrixValue)
  const engineSteps = useSelector(selectEngineSteps)
  const dispatch = useDispatch()
  const matrixColsLen = useSelector(selectMatrixColsLen)
  const matrixRowsLen = useSelector(selectMatrixRowsLen)
  const maxLen = matrixColsLen * matrixRowsLen;
  const currentStep = useSelector(selectCurrentStep)

  const fakeColsLen = useSelector(selectFakeColsLen)

  const activeStep = useSelector(selectActiveStep)
  const plainText = useSelector(selectPlainText)

  const [raw, setRaw] = useState('');
  const [formatted, setFormatted] = useState('');

  const highlightStep = useSelector(selectHighlightStep)


  const [isDecryptMode, setIsDecryptMode] = useState(false)


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



  const [keyDisplay, setKeyDisplay] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);


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


  const [confirmError, setConfirmError] = useState('');

  const handleKeyConfirm = () =>{//ovde napraviti niz koraka


//-------------------------------------------------------------------
    console.log('trenutni current step onconfirm:' + currentStep)
    if(raw.length === 0){
      setConfirmError('Enter at least one pair of digits.')
      setShowKeyError(true)
      return;
    }
    if(raw.length % 2 === 1){
      setConfirmError('Every digit in key must be paired.')
      setShowKeyError(true)
      return;
    }
    if(showKeyError === true){
      setShowKeyError(false);
    }
//-------------------------------------------------------------------

  if (cipherType === 'classic') {
    console.log('classic');
    console.log('raw key', raw);

    const newSteps = createEngineStepsFromRaw(raw, 'classic');
    dispatch(setEngineSteps(newSteps));
  } 
  else if (cipherType === 'chained') {
    console.log('chained');
    console.log('raw key', raw);

    const newSteps = createEngineStepsFromRaw(raw, 'chained');
    dispatch(setEngineSteps(newSteps));
  }


    setFormatted(formatAsPairs(raw));
    setKeyDisplay(true);
    dispatch(setKeyRaw(raw))

    setKeyButtonDisabled(true);
  }

function parseRawKeyToPairs(raw) {

  const cleaned = raw.replace(/[^0-9]/g, '');

  const pairs = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    const a = Number(cleaned[i]);
    const b = Number(cleaned[i + 1]);
    pairs.push([a, b]);
  }

  return pairs;
}

function createEngineStepsFromRaw(raw, cipherType = 'classic') {
  const pairs = parseRawKeyToPairs(raw);   // tvoja postojeća funkcija

  const steps = [];

  pairs.forEach((pair, index) => {
    const axis = index % 2 === 0 ? 'x' : 'y';

    
    // Ako je chained → prvo dodajemo XOR step
    if (cipherType === 'chained') {
      steps.push({
        type: 'xor',
        // numbers: undefined ili [] – kako ti odgovara
        // axis: null ili undefined
        stepIndex: steps.length,          // ili neki drugi način numerisanja
        description: 'XOR with round key', // ili šta god da prikazuješ
        // active: false,
        // možeš dodati još polja ako treba (npr. round: Math.floor(index/2)+1)
      });
    }

    // Zatim uvek dodajemo swap
    steps.push({
      type: 'swap',
      numbers: pair,
      axis: axis,
      stepIndex: steps.length,
      description: `Swap ${pair[0]} ↔ ${pair[1]} (${axis}-axis)`,
      // highlight, positions, itd...
    });

 
  });
  return steps;
}

  const [showKeyError, setShowKeyError] = useState(false)
  const [showPlainTextError, setShowPlainTextError] = useState(false)
  const [keyButtonDisabled, setKeyButtonDisabled] = useState(false)

  const handlePrevious = () => {
    if(activeStep -1 === 2){
      setIsDecryptMode(false)
    }
    //TODO: Ovde je ceo step u levo kada sa vracamo sta da se radi potencijalno ce biti samo gray out dok se ne izvrsi middle
    dispatch(setActiveStep(activeStep - 1));

  
  };



  const handleNext = () => {
    //TODO: Ovde je isto kao gore samo u desno
    // if(activeStep === 0){
    //   const fullText = plainText.padEnd(matrixRowsLen*matrixColsLen, 'X');
    //   const hexText = fullText.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    //   dispatch(setHexText(hexText))
    //   dispatch(setPlainText(fullText))
      
    // }
    // if(activeStep + 1 === 3){
    //   setIsDecryptMode(true)
    // }
    
    // dispatch(setActiveStep(activeStep + 1));

    // console.log(activeStep);


    let canProceed = true;
    let errorMessage = "";
    switch(activeStep){
      case 0:
        if(plainText.trim().length === 0){
          canProceed = false;
          errorMessage = "Unesite tekst pre prelaska na naredni korak."
        }
        break;
      case 1:
        if(!keyDisplay || keyRaw.length === 0 || currentStep < engineSteps.length-1){
          canProceed = false;
          errorMessage = "Zavrsite proces enkripcije pre narednog koraka."
        }
        break;
      case 2:
        setIsDecryptMode(true)
        break;
        
        
    }

    if(canProceed){
      dispatch(setActiveStep(activeStep + 1));
    }else{
      console.log('ERROR: ', errorMessage)
    }



  };


  useEffect(() => {
    console.log('raw:', raw);
    console.log('formatted:', formatAsPairs(raw));
  }, [raw]);




  function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    console.log(hex);
    return hex;
  }

  const [xorMode, setXorMode] = useState('')


const cipherType = useSelector(selectCipherType)






  return (
    <div className='px-6 pt-6 '>
    <div className="bg-gray-900/80  backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300 min-h-[220px] flex flex-col ">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text">
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

{activeStep === 2 && (
<div className="mt-4 flex flex-col gap-2">
  <p className="text-sm font-bold text-gray-200">Encrypted message:</p>
  
  <div className="flex items-center gap-3 bg-gray-800/60 rounded px-2 py-1 min-h-9 border border-gray-700/50">
    <p className="text-gray-200 font-mono break-all flex-1">
      {currentMatrixValue}
      {/* {cipherType === 'chained' ? hexText : plainText} */}
    </p>
    
    <button
      onClick={() => {
        const text = cipherType === 'chained' ? currentMatrixValue : currentMatrixValue;
        navigator.clipboard.writeText(text);
      }}
      className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-700/50"
      title="Copy to clipboard"
    >
      <FiCopy className="w-5 h-5" />
    </button>
  </div>
</div>
)}

{activeStep === 4 && (
<div className="mt-4 flex flex-col gap-2">
  <p className="text-sm font-bold text-gray-200">Decrypted message:</p>
  
  <div className="flex items-center gap-3 bg-gray-800/60 rounded px-3 py-2 min-h-9border border-gray-700/50">
    <p className="text-gray-200 font-mono break-all flex-1">
      {cipherType === 'chained' ? currentMatrixValue : currentMatrixValue}
    </p>
    
    <button
      onClick={() => {
        const text = cipherType === 'chained' ? currentMatrixValue : currentMatrixValue;
        navigator.clipboard.writeText(text);
        // opciono: možeš dodati toast ili promenu ikone na kratko
        // npr. setCopied(true); setTimeout(() => setCopied(false), 2000);
      }}
      className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-700/50"
      title="Copy to clipboard"
    >
      <FiCopy className="w-5 h-5" />
    </button>
  </div>
</div>
)}

{activeStep === 0 && (
  <div className="mt-4 flex items-center gap-3">

    {/* MESSAGE */}
    <div className="relative flex-1 min-w-[220px]">
      <input
        type="text"
        maxLength={maxLen}
        value={plainText}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().replace(/\s+/g, '');
          dispatch(setPlainText(val));
          dispatch(
            setHexText(
              val
                .split('')
                .map(c =>
                  c.charCodeAt(0).toString(16).padStart(2, '0')
                )
                .join('')
            )
          );
        }}
        className="w-full text-gray-200 bg-gray-700/60 rounded px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Message"
      />

      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
        {plainText.length}/{maxLen}
      </span>
    </div>

    {/* ALGORITHM PICKER */}
    <select
      value={xorMode}
      onChange={(e) =>{

        console.log(e.target.value)
        if(e.target.value === 'chained'){
          dispatch(setCipherType('chained'))

        }else if(e.target.value === 'classic'){
          dispatch(setCipherType('classic'))

        }

        dispatch(setXorMode(e.target.value))
        
      }
      }
      className="bg-gray-700 text-gray-200 text-sm rounded px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="classic">Classic</option>
      <option value="chained">Chained XOR</option>
      {/* <option value="shifting">Shifting XOR</option> */}
    </select>

    {/* ROWS */}
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400">R</span>
      <button
        onClick={() => dispatch(setRowsLen(Math.max(2, matrixRowsLen - 1)))}
        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
      >
        −
      </button>
      <span className="w-5 text-center text-gray-200 text-sm">
        {matrixRowsLen}
      </span>
      <button
        onClick={() =>{
          console.log(matrixRowsLen + 1)
          dispatch(setRowsLen(Math.min(10, matrixRowsLen + 1)))}
        } 
        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
      >
        +
      </button>
    </div>

    {/* COLS */}
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400">C</span>
      <button
        onClick={() => dispatch(setFakeColsLen(Math.max(2, fakeColsLen - 1)))}
        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
      >
        −
      </button>
      <span className="w-5 text-center text-gray-200 text-sm">
        {matrixColsLen}
      </span>
      <button
        onClick={() => dispatch(setFakeColsLen(Math.min(10,fakeColsLen + 1)))}
        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
      >
        +
      </button>
    </div>

  </div>
)}


        <div className={`text-white text-m mt-3 ${(activeStep === 1 || activeStep === 3) ? 'visible' : 'hidden'}`}>
          {/* {if(activeStep === 1)
            {
              keyButtonDisabled ? 'Encryption steps:' : 'Enter key:'
            }
            } */}
            <div className={`${activeStep===1 ? 'visible':'hidden'}`}>{keyButtonDisabled ? 'Encryption steps:' : 'Enter key:'}</div>
            <div className={`${activeStep===3 ? 'visible':'hidden'}`}>Decryption steps:</div>
        </div>
      {/*//GLAVNI STEP*/}
      <div
        className={`flex items-start gap-2 mt-1 ${
          (activeStep === 1 ||activeStep == 3) ? 'flex' : 'hidden'
        }`}
      >
        
        <div className="flex-1">
          {
            keyDisplay ?
              <div className="w-full text-gray-300 bg-gray-700/50 rounded items-center px-2 py-1.5 text-sm flex flex-wrap gap-1 min-h-9">
              {(isDecryptMode ? [...engineSteps].reverse() : engineSteps).map((step, originalIndex) => {
                  const displayIndex = isDecryptMode 
                    ? engineSteps.length - 1 - originalIndex 
                    : originalIndex;
                  return (
                    <span
                      key={displayIndex}
                      className={`inline-flex items-center justify-center rounded px-1.5 py-[2px] text-sm min-w-[3.2rem]
                        ${displayIndex === highlightStep 
                          ? 'text-blue-200 bg-blue-500/20 border border-blue-400/50 font-bold' 
                          : 'text-gray-300 bg-gray-700/40'}
                      `}
                    >
                      {step.type === 'xor' ? 'XOR' : `(${step.numbers[0]}, ${step.numbers[1]})`}
                    </span>
                  );
                })}
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
                    e.preventDefault();
                    setRaw((prev) => prev.slice(0, -1));
                  }
                }}
                className="w-full text-gray-200 bg-gray-700/60 rounded px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
        }
          {showKeyError && (
            <p className="mt-1 text-xs text-red-400">
              {confirmError}
            </p>
          )}
        </div>

        <div>

        <button 
          className={` ${ activeStep === 1 ? 'visible' : 'hidden' } px-3 text-sm py-2 rounded  text-white  ${keyButtonDisabled? 'bg-gray-800' : 'bg-blue-600 hover:bg-blue-500'} `}
          disabled={keyButtonDisabled}
          onClick={handleKeyConfirm}
          >
          Confirm
        </button>
          </div>
        <button
className={`
    px-2 py-2 min-h-9 text-sm rounded text-gray-200 transition-colors
    ${isDecryptMode 
      ? 'bg-blue-600 hover:bg-blue-500'           // decrypt: zelena paleta
      : 'bg-blue-600 hover:bg-blue-500'}            // encrypt: plava paleta
    ${isDecryptMode 
      ? (currentStep >= engineSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : '')
      : (currentStep <= -1 ? 'opacity-50 cursor-not-allowed' : '')}
  `}          disabled = {isDecryptMode ? (currentStep >= engineSteps.length - 1) : (currentStep <= -1)}
          onClick={() =>{
            if(!isDecryptMode){
              dispatch(setHighlightStep(currentStep));
              dispatch(setCurrentStep(currentStep - 1))
            }else{
            dispatch(setHighlightStep(currentStep + 1));
            dispatch(setCurrentStep(currentStep + 1))
            }
          }}>
          <BiSolidLeftArrow/>
        </button>
        <button
className={`
    px-2 py-2 min-h-9 rounded text-gray-200 transition-colors
    ${isDecryptMode 
      ? 'bg-blue-600 hover:bg-blue-500'           // decrypt: zelena
      : 'bg-blue-600 hover:bg-blue-500'}            // encrypt: plava
    ${isDecryptMode 
      ? (currentStep <= -1 ? 'opacity-50 cursor-not-allowed' : '')
      : (currentStep >= engineSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : '')}
  `}          // disabled = {visualStep >= visualSteps.length - 1}
          // disabled = {currentStep >= engineSteps.length - 1}
          disabled = {isDecryptMode ? (currentStep <= -1) : (currentStep >= engineSteps.length - 1)}


          onClick={() =>{
            if(!isDecryptMode){

                          dispatch(setHighlightStep(currentStep + 1));
            dispatch(setCurrentStep(currentStep + 1))
            }else{
              dispatch(setHighlightStep(currentStep));
              dispatch(setCurrentStep(currentStep - 1))
            }
            // dispatch(setHighlightStep(currentStep + 1));
            // dispatch(setCurrentStep(currentStep + 1))

          }}>
          <BiSolidRightArrow />
        </button>
      </div>


    </div>
    {/* <div className={`items-center flex justify-center mb-8 relative ${activeStep === 1 || activeStep === 3 ? 'visible' : 'hidden'} `}>
      <span className='absolute top-3 text-blue-600 '>
      {highlightStep == -1 ? `` : engineSteps[highlightStep]?.description}
      </span>
    </div> */}

    </div>
    
  );
}
