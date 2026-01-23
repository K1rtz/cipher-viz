import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveStep,
  selectPlainText,
  selectHexText,
  selectKeyRaw,
  selectCurrentStep,
  selectHighlightStep,
  selectMatrixRowsLen,
  selectMatrixColsLen,
  selectFakeColsLen,
  selectCipherType,
  selectEngineSteps,
} from './../store/selectors/stepInfoSelector.js';
import { setHexText, setCurrentMatrixValue ,setRowsLen, setColsLen, setFakeColsLen } from './../store/reducers/stepInfoReducer'


export default function MatrixDisplay() {
  
  const dispatch = useDispatch()

  const rows = useSelector(selectMatrixRowsLen)
  const cols = useSelector(selectMatrixColsLen)
  const cipherType = useSelector(selectCipherType)
  const fakeColsLen = useSelector(selectFakeColsLen)
  const activeStep = useSelector(selectActiveStep);
  const plainText = useSelector(selectPlainText);
  const currentStep = useSelector(selectCurrentStep);
  const keyRaw = useSelector(selectKeyRaw);
  const highlightStep = useSelector(selectHighlightStep);
  const engineSteps = useSelector(selectEngineSteps)
  const hexText = useSelector(selectHexText)

  const [isRowStep, setIsRowStep] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState([])
  
  

  /* ---------- HEADERS ---------- */

  const [rowHeaders, setRowHeaders] = useState(
    Array.from({ length: rows }, (_, i) => ({ id: i, label: i }))
  );

  const [columnHeaders, setColumnHeaders] = useState(
    Array.from({ length: cols }, (_, i) => ({ id: i, label: i }))
  );

  /* ---------- MATRIX ---------- */

  const [matrixRows, setMatrixRows] = useState(
    Array.from({ length: rows }, (_, r) => ({
      rowId: r,
      tiles: Array.from({ length: cols }, (_, c) => ({
        id: r * cols + c,
        colId: c,
        value: ' ',
      })),
    }))
  );

  /* ---------- TEXT / HEX ---------- */


  function resetText(){
    if (plainText.length === 0) return
    console.log('x')
    const filler = ' ';
    
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: row.tiles.map(tile => ({
          ...tile,
          value: cipherType === 'chained' ? (
            tile.id * 2 + 1 < hexText.length
              ? hexText.slice(tile.id * 2, tile.id * 2 + 2)
              : filler) : (tile.id < plainText.length ? plainText.slice(tile.id, tile.id+1) : filler),
        })),
      }))
    );
  }

  useEffect(() => {
    if (plainText.length === 0) return
    console.log('x')
    const filler = ' ';
    
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: row.tiles.map(tile => ({
          ...tile,
          value: cipherType === 'chained' ? (
            tile.id * 2 + 1 < hexText.length
              ? hexText.slice(tile.id * 2, tile.id * 2 + 2)
              : filler) : (tile.id < plainText.length ? plainText.slice(tile.id, tile.id+1) : filler),
        })),
      }))
    );
  }, [hexText, cipherType, plainText]);

  /* ---------- STEP LOGIC ---------- */

  const getPair = step => {
    const i = step * 2;
    return [Number(keyRaw[i]), Number(keyRaw[i + 1])];
  };

  const swapRowsByPosition = (i, j) => {
    setRowHeaders(prev => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

    setMatrixRows(prev => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const swapColumnsByPosition = (i, j) => {
    setColumnHeaders(prev => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

    setMatrixRows(prev =>
      prev.map(row => {
        const nextTiles = [...row.tiles];
        [nextTiles[i], nextTiles[j]] = [nextTiles[j], nextTiles[i]];
        return { ...row, tiles: nextTiles };
      })
    );
  };

  const applyStep = step => {
    if (step < 0) return;
    console.log("ZOVEMOAPPLYSTEP")
    if(engineSteps[step].type==='swap'){ 
      setHighlightedPositions([engineSteps[step].numbers[0], engineSteps[step].numbers[1]]);

      if(engineSteps[step].axis === 'x'){
        setIsRowStep(true)
        swapRowsByPosition(engineSteps[step].numbers[0], engineSteps[step].numbers[1])
      }else{
        setIsRowStep(false)
        swapColumnsByPosition(engineSteps[step].numbers[0], engineSteps[step].numbers[1])
      }

    }else{
      setHighlightedPositions([]);
      dispatch(setHexText(chainXOR(hexText, 123)))
      setTilePulse(true)
      setTimeout(()=>setTilePulse(false),200)
      console.log('XOR UNAPRED')
    }
  };

  const undoStep = step => {
    if (step < 0) return;

          console.log("ZOVEMOUNDO")
    if(engineSteps[step].type==='swap'){
      setHighlightedPositions([engineSteps[step].numbers[0], engineSteps[step].numbers[1]]);
      if(engineSteps[step].axis === 'x'){
        setIsRowStep(true)
        swapRowsByPosition(engineSteps[step].numbers[0], engineSteps[step].numbers[1])
      }else{
        setIsRowStep(false)
        swapColumnsByPosition(engineSteps[step].numbers[0], engineSteps[step].numbers[1])
      }
    }else{
      setHighlightedPositions([]);
      dispatch(setHexText(chainXORInverse(hexText, 123)))
      setTilePulse(true)
      setTimeout(()=>setTilePulse(false),200)
      console.log('XOR UNAZAD ;)')
    }
  };

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    console.log("CURRENTSTEP::::", currentStep)
    console.log("ENGINESTEP:", engineSteps[currentStep])
    const prev = prevStepRef.current;
    if (prev === currentStep) return;

    console.log('prevstep:', prevStepRef.current)
    console.log('currentstep:', currentStep)

    if (currentStep > prev) {
      // idemo DESNO → primeni currentStep
      console.log('APPLYCURRENTSTEP')
      applyStep(currentStep);
    } else {
      // idemo LEVO → vrati prev
      console.log('APPLYPREVSTEP')
      undoStep(prev);
    }

    prevStepRef.current = currentStep;
  }, [currentStep]);

  /* ---------- HIGHLIGHT ---------- */

  // const highlightedPositions = useMemo(() => {
  //   if (highlightStep == null) return null;
  //   const [x, y] = getPair(highlightStep);
  //   if (Number.isNaN(x) || Number.isNaN(y)) return null;
  //   return [x, y];
  // }, [highlightStep, keyRaw]);





function chainXOR(hexText, key) {
  // Pretvori hex string u niz bajtova
  let bytes = [];
  for (let i = 0; i < hexText.length; i += 2) {
    bytes.push(parseInt(hexText.substr(i, 2), 16));
  }

  let result = [];
  let prev = key; // prvi XOR ide sa sifrom

  for (let i = 0; i < bytes.length; i++) {
    let encoded = bytes[i] ^ prev; // XOR sa prethodnim
    result.push(encoded.toString(16).padStart(2, "0").toUpperCase());
    prev = encoded; // sledeći XOR ide sa ovim rezultatom
  }

  return result.join("");
}

function chainXORInverse(hexText, key) {
  // Pretvori hex string u niz bajtova (ovo su encoded bajtovi)
  let bytes = [];
  for (let i = 0; i < hexText.length; i += 2) {
    bytes.push(parseInt(hexText.substr(i, 2), 16));
  }

  let result = [];
  let prev = key; // isti početni ključ

  for (let i = 0; i < bytes.length; i++) {
    let decoded = bytes[i] ^ prev; // XOR sa prethodnim šifratom
    result.push(decoded.toString(16).padStart(2, "0").toUpperCase());
    prev = bytes[i]; // OVDE je razlika: prev je encoded bajt
  }

  return result.join("");
}



  
  /* ---------- RENDER ---------- */
function readMatrixRowMajor(matrixRows) {
  console.log('READING')
  const matrixValue =  matrixRows.flatMap(row => row.tiles.map(t => t.value)).join('');
  dispatch(setCurrentMatrixValue(matrixValue))
  return matrixValue
}

useEffect(()=>{
  readMatrixRowMajor(matrixRows)
},[activeStep])

const [colsSwap, setColsSwap] = useState(false);


useEffect(() => {
  const content = readMatrixRowMajor(matrixRows);
  

  setRowHeaders(
    Array.from({ length: rows }, (_, i) => ({ id: i, label: i }))
  );

  setColumnHeaders(
    Array.from({ length: cols }, (_, i) => ({ id: i, label: i }))
  );

  setMatrixRows(
    Array.from({ length: rows }, (_, r) => ({
      rowId: r,
      tiles: Array.from({ length: cols }, (_, c) => ({
        id: r * cols + c,
        colId: c,
        value: content[r * cols + c] ?? ' ',
      })),
    }))
  );
  resetText()
}, [rows, cols]);

const [disableLayout, setDisableLayout] = useState(false);

const changeCols = delta => {
  console.log(delta)
  setDisableLayout(true);

  setColumnHeaders(prev => {
    const nextCols = Math.max(1, prev.length + delta);
    return Array.from({ length: nextCols }, (_, i) => ({
      id: i,
      label: i,
    }));
  });

  setMatrixRows(prev =>
    prev.map(row => {
      const nextLen = Math.max(1, row.tiles.length + delta);

      const nextTiles =
        delta > 0
          ? [
              ...row.tiles,
              ...Array.from({ length: delta }, (_, i) => ({
                id: row.rowId * 1000 + row.tiles.length + i,
                colId: row.tiles.length + i,
                value: ' ',
              })),
            ]
          : row.tiles.slice(0, nextLen);

      return { ...row, tiles: nextTiles };
    })
  );

  dispatch(setColsLen(fakeColsLen))
  // setColsSwap(!colsSwap)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => setDisableLayout(false));
  }); 
};

useEffect(()=>{
  if(fakeColsLen === cols) return;

  const id = setTimeout(()=>{
    const delta = fakeColsLen < cols ? -1 : 1;
    changeCols(delta);
  }, 10); // 25 fps

  return () => clearTimeout(id);
},[fakeColsLen])

  const [tilePulse, setTilePulse] = useState(false);

  return (
    <div className="flex flex-col items-center py-6">

      <div className="w-full px-6">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl py-6 shadow-xl">
          <div
            className="grid gap-2 justify-center "
            style={{ gridTemplateColumns: `64px repeat(${cols}, 64px)` }}
          >
            {/* Corner */}
            <div
              className="flex items-center justify-center font-bold text-blue-500 text-bold rounded-md border border-gray-700/90 "
              style={{ width: 64, height: 64 }}
            >
              {cipherType === 'classic' ? 'C' : 'HEX'}
            </div>

            {/* Column headers */}
            {columnHeaders.map((header, c) => {

              const isHighlighted = !isRowStep && highlightedPositions?.includes(c) && (activeStep === 1 || activeStep === 3) ;

              return (
                <motion.div
                  key={header.id}
                  layout
                  initial={{
                    backgroundColor: 'rgba(31,41,55,0.3)',  // default boja (ne-highlight)
                    color: '#fff',
                  }}
                  animate={{
                    backgroundColor: isHighlighted
                      ? 'rgba(59,130,226,0.45)'
                      : 'rgba(31,41,55,0.3)',
                    color: '#fff',
                  }}
                  transition={{ layout: activeStep === 0 && disableLayout ? { duration: 0 } :  { type: 'spring', stiffness: 80, damping: 20 } }}
                  className="flex items-center justify-center rounded-md border border-gray-700/50"
                  style={{ width: 64, height: 64 }}
                >
                  {header.label}
                </motion.div>
              );
            })}

            {/* Rows */}
            {matrixRows.map((row, r) => {
              const isHighlighted =
                isRowStep &&
                highlightedPositions?.includes(r) &&
                (activeStep === 1 || activeStep === 3);

              return (
                <React.Fragment key={row.rowId}>
                  {/* Row header */}
                  <motion.div
                    layout
                    initial={{
                      backgroundColor: 'rgba(31,41,55,0.3)',  // default boja (ne-highlight)
                      color: '#fff',
                    }}
                    animate={{
                      backgroundColor: isHighlighted
                        ? 'rgba(59,130,246,0.35)'
                        : 'rgba(31,41,55,0.3)',
                      color: '#fff',
                    }}
                    transition={{ layout:  activeStep === 0 && disableLayout ? { duration: 0 } :  { type: 'spring', stiffness: 80, damping: 20 } }}
                    className="flex items-center justify-center rounded-md border border-gray-700/50"
                    style={{ width: 64, height: 64 }}
                  >
                    {rowHeaders[r].label}
                  </motion.div>

                  {/* Tiles */}
                  {row.tiles.map(tile => (
                    <motion.div
                      key={tile.id}
                      layout 
                      transition={ { layout:  activeStep === 0 && disableLayout ? { duration: 0 } : {type: 'spring', stiffness: 80, damping: 20 }}}
                      className={`flex items-center justify-center rounded-lg font-mono text-xl font-bold border ${
                        tile.value === ' '
                          ? 'bg-gray-800/50 text-gray-600 border-gray-700/50'
                          : 'bg-[#0f2161] text-white border border-blue-800 shadow-md'//bg-blue-800/90
                      }
                    ${tilePulse ? 'animate-pulse' : ''}
                    `
                    }
                    animate={{
                        scale: tilePulse ? 1.1 : 1,  
                      }}
                      style={{ width: 64, height: 64 }}
                    >
                      {tile.value === ' ' ? 'X' : tile.value}
                    </motion.div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
