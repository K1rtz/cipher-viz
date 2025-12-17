import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectActiveStep, selectPlainText, selectRowKey, selectColumnKey, selectNextSubstepSignal, selectRowsInfo,  } from './../store/selectors/stepInfoSelector.js';

export default function MatrixDisplay({ rows = 7, cols = 7 }) {

  const activeStep = useSelector(selectActiveStep);
  const [prevStep, setPrevStep] = useState(useSelector(selectActiveStep));

  const plainText = useSelector(selectPlainText);
  const rowKey = useSelector(selectRowKey);
  const columnKey = useSelector(selectColumnKey);
  const nextSubstep = useSelector(selectNextSubstepSignal);

  // Inicijalni tiles sa stabilnim colId
  const [matrixRows, setMatrixRows] = useState(
    Array.from({ length: rows }, (_, r) => ({
      rowId: r, // stabilan ID reda
      tiles: Array.from({ length: cols }, (_, c) => ({
        id: r * cols + c,
        colId: c, // stabilan ID kolone
        value: 'S',
      })),
    }))
  );

  const rowsInfo = useSelector(selectRowsInfo);

  useEffect(() => {
    console.log('rowsInfo')
    console.log(rowsInfo.substeps[rowsInfo.currentStep]);

    if(rowsInfo.substeps.length > 2){
      const permutation = rowsInfo.substeps[rowsInfo.currentStep].join('')
      console.log('permutation', permutation)
      handleAnimateRows(permutation)
    }

  },[nextSubstep])

  const [columnHeaders, setColumnHeaders] = useState(
    Array.from({ length: cols }, (_, i) => ({ id: i, label: i }))
  );

  const [rowHeaders, setRowHeaders] = useState(
    Array.from({ length: rows }, (_, i) => ({ id: i, label: i }))
  );

  const [columnOrder, setColumnOrder] = useState(Array.from({ length: cols }, (_, i) => i));
  const [rowOrder, setRowOrder] = useState(Array.from({ length: rows }, (_, i) => i));

  // Popunjavanje matrice tekstom
  useEffect(() => {
    const filler = ' ';
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: row.tiles.map(tile => ({
          ...tile,
          value: tile.id < plainText.length ? plainText[tile.id] : filler,
        })),
      }))
    );
  }, [plainText]);

  // Permutacija kolona (uvek referencira inicijalne kolone)
  const handleAnimateColumns = (key) => {
    const targetOrder = key.split('').map(Number);
    setColumnOrder(targetOrder);

    setColumnHeaders(targetOrder.map(i => ({ id: i, label: i })));

    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: targetOrder.map(colId => row.tiles.find(t => t.colId === colId)),
      }))
    );
  };

  // Permutacija redova (uvek referencira inicijalne redove)
  const handleAnimateRows = (key) => {
    const targetOrder = key.split('').map(Number);
    setRowOrder(targetOrder);

    setRowHeaders(targetOrder.map(i => ({ id: i, label: i })));

    setMatrixRows(prev =>
      targetOrder.map(rowId => prev.find(r => r.rowId === rowId))
    );
  };

  // Na promenu koraka
  useEffect(() => {
    if (prevStep < activeStep) {
      if (activeStep === 2) handleAnimateRows(rowKey);
      else if (activeStep === 3) handleAnimateColumns(columnKey);
    } else if (prevStep > activeStep) {
      if (activeStep === 2) handleAnimateColumns('6543210');
      else if (activeStep === 1) handleAnimateRows('6543210');
    }
    setPrevStep(activeStep);
  }, [activeStep]);



  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            DT Matrix
          </h3>

          <div
            className="grid gap-2 justify-center"
            style={{ gridTemplateColumns: `64px repeat(${cols}, 64px)` }}
          >
            {/* Top-left corner */}
            <div />

            {/* Column headers */}
            {columnHeaders.map(header => (
              <motion.div
                key={header.id}
                layout
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="flex items-center justify-center text-gray-300 bg-gray-800/30 rounded-md border border-gray-700/50"
                style={{ width: 64, height: 64 }}
              >
                {header.label}
              </motion.div>
            ))}

            {/* Rows */}
            {matrixRows.map((row, r) => (
              <React.Fragment key={row.rowId}>
                {/* Row header */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  className="flex items-center justify-center text-gray-300 bg-gray-800/30 rounded-md border border-gray-700/50"
                  style={{ width: 64, height: 64 }}
                >
                  {rowHeaders[r].label}
                </motion.div>

                {/* Tiles */}
                {row.tiles.map(tile => (
                  <motion.div
                    key={tile.id}
                    layout
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className={`flex items-center justify-center rounded-lg font-mono text-xl border transition-colors duration-300 ease-out border-gray-700/50 ${
                      tile.value === ' ' && activeStep === 0
                        ? 'bg-gray-800/50 text-gray-600'
                        : 'bg-blue-600/60 text-white border-blue-400 shadow-md'
                    }`}
                    style={{ width: 64, height: 64 }}
                  >
                    {tile.value === ' ' ? 'X' : tile.value}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-400 text-center">
            {/* Visual representation of the double transposition cipher */}
          </div>
        </div>
      </div>
    </div>
  );
}
