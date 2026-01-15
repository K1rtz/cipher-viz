import React, {useEffect, useMemo, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  selectActiveStep,
  selectPlainText,
  selectMatrixColsLen,
  selectMatrixRowsLen,
  selectCurrentStep,
  selectHighlightStep,
} from './../store/selectors/stepInfoSelector.js'
import { setActiveStep, setPlainText, setHighlightStep, setCurrentStep, setKeyRaw, setHexText} from './../store/reducers/stepInfoReducer'
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";

export default function StepController() {
  const steps = [
    {
      id: 1,
      title: 'Plain Text',
      description:
        'Enter the original message that will be encrypted using the Double Transposition cipher. ' +
        'This text will be placed sequentially into the matrix row by row and serves as the starting point of the encryption process.',
      keyText: 'Message:'
    },
    {
      id: 2,
      title: 'Transposition key and steps simulation',
      description:
        'Enter a key with an even number of digits.  \n' +
        '  Then simulate the transposition step by step using the left/right arrows.\n' + 'Highlighted pair represents previous swap.',
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
  const matrixColsLen = useSelector(selectMatrixColsLen)
  const matrixRowsLen = useSelector(selectMatrixRowsLen)
  const maxLen = matrixColsLen * matrixRowsLen;
  const currentStep = useSelector(selectCurrentStep)


  const activeStep = useSelector(selectActiveStep)
  const plainText = useSelector(selectPlainText)

  const [raw, setRaw] = useState('');
  const [formatted, setFormatted] = useState('');

  const highlightStep = useSelector(selectHighlightStep)



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

  const handleKeyConfirm = () =>{

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
    setFormatted(formatAsPairs(raw));
    setKeyDisplay(true);
    dispatch(setKeyRaw(raw))

    setKeyButtonDisabled(true);
  }

  const [showKeyError, setShowKeyError] = useState(false)
  const [showPlainTextError, setShowPlainTextError] = useState(false)
  const [keyButtonDisabled, setKeyButtonDisabled] = useState(false)

  const handlePrevious = () => {
    //TODO: Ovde je ceo step u levo kada sa vracamo sta da se radi potencijalno ce biti samo gray out dok se ne izvrsi middle
    dispatch(setActiveStep(activeStep - 1));

  
  };

  // const hexText = useMemo(() => {
  //   if(activeStep !== 0) return
  //   return plainText.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  // }, [plainText]);

  const handleNext = () => {
    //TODO: Ovde je isto kao gore samo u desno
    if(activeStep === 0){
      const fullText = plainText.padEnd(49, 'X');
      const hexText = fullText.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      dispatch(setHexText(hexText))
      dispatch(setPlainText(fullText))
      
    }
    
    dispatch(setActiveStep(activeStep + 1));

    console.log(activeStep);
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

  return (
    <div className='px-6 pt-6 '>
    <div className="bg-gray-900/80 min-h-[170px] backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text">
         {steps[activeStep].title}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={()=>{stringToHex(plainText)}}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-md`}
          >
            XOR
          </button>
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
            onChange={(e) =>{
              dispatch(setPlainText(e.target.value.toUpperCase().replace(/\s+/g, '')))
              dispatch(setHexText(e.target.value.toUpperCase().replace(/\s+/g,'').split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')))
            }}
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
                    className={`inline-flex items-center justify-center rounded px-1 leading-none p-1
                    ${i === highlightStep ? 'text-blue-400 bg-blue-500/10 border border-blue-400 font-bold' : 'text-gray-300'}`}                                  >
                  {pair}
                </span>
                ))}
              </div>
            :
          <input
            type="text"
            value={formatAsPairs(raw)}
            onChange={(e) => {

              const digitsOnly = e.target.value.replace(/[^0-6]/g, '');
              setRaw(digitsOnly);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                setRaw((prev) => prev.slice(0, -1));
              }
            }}
            className="w-full text-gray-300 bg-gray-700/50 rounded px-2 py-1 text-sm"
          />

          }
          {showKeyError && (
            <p className="mt-1 text-xs text-red-400">
              {confirmError}
            </p>
          )}
        </div>


        <button
          className={`px-3 text-sm py-1 rounded text-white  ${keyButtonDisabled? 'bg-gray-800' : 'bg-blue-600 hover:bg-blue-500'} `}
          disabled={keyButtonDisabled}
          onClick={handleKeyConfirm}//TODO nema vise generate substeps sad se substepovi unose rucno
        >
          Confirm
        </button>
        <button
          className={`px-2 py-1.5 rounded text-gray-200  ${currentStep <= -1 ? 'bg-gray-600' : 'bg-blue-600'} `}
          disabled = {currentStep <= -1}
          onClick={() =>{
            dispatch(setHighlightStep(currentStep));
            console.log(currentStep-1)
            dispatch(setCurrentStep(currentStep - 1))
          }}>
          <BiSolidLeftArrow/>
        </button>
        <button
          className={`px-2 py-1.5 rounded text-gray-200  ${currentStep >= pairs.length - 1 ? 'bg-gray-600' : 'bg-blue-600'} `}
          disabled = {currentStep >= pairs.length - 1}
          onClick={() =>{
            dispatch(setHighlightStep(currentStep + 1));
            console.log(highlightStep)
            console.log(currentStep+1)
            dispatch(setCurrentStep(currentStep + 1))
            console.log('right' + activeIndex)
          }}>
          <BiSolidRightArrow />
        </button>
      </div>


    </div>
    </div>
  );
}
