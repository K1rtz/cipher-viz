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
} from './../store/selectors/stepInfoSelector.js';
import { setHexText } from './../store/reducers/stepInfoReducer'


export default function MatrixDisplay({ rows = 7, cols = 7 }) {
  const activeStep = useSelector(selectActiveStep);
  const plainText = useSelector(selectPlainText);
  const currentStep = useSelector(selectCurrentStep);
  const keyRaw = useSelector(selectKeyRaw);
  const highlightStep = useSelector(selectHighlightStep);

  const dispatch = useDispatch()

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

  const [showHex, setShowHex] = useState(true);

  // const hexText = useMemo(() => {
  //   if(activeStep !== 0) return
  //   return plainText.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  // }, [plainText]);

  const hexText = useSelector(selectHexText)

  useEffect(() => {
    if (plainText.length === 0) return
    console.log('x')
    const filler = ' ';
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: row.tiles.map(tile => ({
          ...tile,
          value: showHex ? (
            tile.id * 2 + 1 < hexText.length
              ? hexText.slice(tile.id * 2, tile.id * 2 + 2)
              : filler) : (tile.id < plainText.length ? plainText.slice(tile.id, tile.id+1) : filler),
        })),
      }))
    );
  }, [hexText, showHex, plainText]);

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
    const [x, y] = getPair(step);

    step % 2 === 0
      ? swapRowsByPosition(x, y)
      : swapColumnsByPosition(x, y);
  };

  const undoStep = step => {
    if (step < 0) return;
    const [x, y] = getPair(step);

    // swap je involucija
    step % 2 === 0
      ? swapRowsByPosition(x, y)
      : swapColumnsByPosition(x, y);
  };

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const prev = prevStepRef.current;
    if (prev === currentStep) return;

    if (currentStep > prev) {
      // idemo DESNO → primeni currentStep
      applyStep(currentStep);
    } else {
      // idemo LEVO → vrati prev
      undoStep(prev);
    }

    prevStepRef.current = currentStep;
  }, [currentStep]);

  /* ---------- HIGHLIGHT ---------- */

  const highlightedPositions = useMemo(() => {
    if (highlightStep == null) return null;
    const [x, y] = getPair(highlightStep);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    return [x, y];
  }, [highlightStep, keyRaw]);

  const isRowStep = highlightStep % 2 === 0;



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


  
  /* ---------- RENDER ---------- */

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full px-6">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl py-6 shadow-xl">
          <div
            className="grid gap-2 justify-center"
            style={{ gridTemplateColumns: `64px repeat(${cols}, 64px)` }}
          >
            {/* Corner */}
            <div
              className="flex items-center justify-center rounded-md border border-gray-700/50 cursor-pointer"
              style={{ width: 64, height: 64 }}
              // onClick={() => setShowHex(v => !v)}
              onClick={() => {
                setShowHex(v => !v)
                
                // let chained = chainXOR(hexText, 14)
                // dispatch(setHexText(chained));

                // console.log(plainText)
              }
              }
            >
              HEX
            </div>

            {/* Column headers */}
            {columnHeaders.map((header, c) => {
              const isHighlighted =
                !isRowStep &&
                highlightedPositions?.includes(c) &&
                activeStep === 1;

              return (
                <motion.div
                  key={header.id}
                  layout
                  animate={{
                    backgroundColor: isHighlighted
                      ? 'rgba(59,130,246,0.35)'
                      : 'rgba(31,41,55,0.3)',
                    color: '#fff',
                  }}
                  transition={{ layout: { type: 'spring', stiffness: 80, damping: 20 } }}
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
                activeStep === 1;

              return (
                <React.Fragment key={row.rowId}>
                  {/* Row header */}
                  <motion.div
                    layout
                    animate={{
                      backgroundColor: isHighlighted
                        ? 'rgba(59,130,246,0.35)'
                        : 'rgba(31,41,55,0.3)',
                      color: '#fff',
                    }}
                    transition={{ layout: { type: 'spring', stiffness: 80, damping: 20 } }}
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
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                      className={`flex items-center justify-center rounded-lg font-mono text-xl font-bold border ${
                        tile.value === ' '
                          ? 'bg-gray-800/50 text-gray-600 border-gray-700/50'
                          : 'bg-blue-800/90 text-white border-blue-400 shadow-md'
                      }`}
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
