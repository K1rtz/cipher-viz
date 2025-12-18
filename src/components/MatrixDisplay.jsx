import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectActiveStep,
  selectPlainText,
  selectRowKey,
  selectColumnKey,
  selectNextSubstepSignal,
  selectRowsInfo, selectColumnsInfo,
} from './../store/selectors/stepInfoSelector.js';
import {setRowsAdvanceNext, setColumnsAdvanceNext} from './../store/reducers/stepInfoReducer'

export default function MatrixDisplay({ rows = 7, cols = 7 }) {

  const activeStep = useSelector(selectActiveStep);
  const prevStepState = useState(activeStep)[0]; // za jednostavnost
  const plainText = useSelector(selectPlainText);
  const rowKey = useSelector(selectRowKey);
  const columnKey = useSelector(selectColumnKey);
  const nextSubstep = useSelector(selectNextSubstepSignal);
  const rowsInfo = useSelector(selectRowsInfo);
  const columnsInfo = useSelector(selectColumnsInfo);

  // Inicijalni tiles sa stabilnim colId
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

  const [rowHeaders, setRowHeaders] = useState(
    Array.from({ length: rows }, (_, i) => ({ id: i, label: i }))
  );
  const dispatch = useDispatch()

  const [columnHeaders, setColumnHeaders] = useState(
    Array.from({ length: cols }, (_, i) => ({ id: i, label: i }))
  );


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

  // Permutacija redova (uvek referencira inicijalne redove)
  const handleAnimateRows = (key) => {
    const targetOrder = key.split('').map(Number);
    setRowHeaders(targetOrder.map(i => ({ id: i, label: i })));
    setMatrixRows(prev =>
      targetOrder.map(rowId => prev.find(r => r.rowId === rowId))
    );
  };
  const handleAnimateColumns = (key) => {
    const targetOrder = key.split('').map(Number);
    setColumnHeaders(targetOrder.map(i => ({ id: i, label: i })));
    // tiles po kolonama
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: targetOrder.map(colId =>
          row.tiles.find(t => t.colId === colId)
        ),
      }))
    );
  };

  // Na substep signal
  // useEffect(() => {
  //   if (!rowsInfo.substeps.length) return;
  //   const currentStepArray = rowsInfo.substeps[rowsInfo.currentStep];
  //   const permutation = currentStepArray.join('');
  //   handleAnimateRows(permutation);
  // }, [nextSubstep]);

  useEffect(() => {
    if (!rowsInfo.advanceNext) return;
    if (!rowsInfo.substeps.length) return;

    const currentStepArray = rowsInfo.substeps[rowsInfo.currentStep];
    const permutation = currentStepArray.join('');
    handleAnimateRows(permutation);

    dispatch(setRowsAdvanceNext(false)) // reset signal
  }, [rowsInfo.advanceNext])

  useEffect(() => {
    console.log('usloseuynextdugmej')
    if (!columnsInfo.advanceNext) return;
    if (!columnsInfo.substeps.length) return;

    const currentStepArray = columnsInfo.substeps[columnsInfo.currentStep];
    const permutation = currentStepArray.join('');
    handleAnimateColumns(permutation);

    dispatch(setColumnsAdvanceNext(false)) // reset signal
  }, [columnsInfo.advanceNext])

  // Kreiranje niza redova koji su na svojoj finalnoj poziciji
  const fixedRows = useMemo(() => {
    if (!rowsInfo.substeps.length) return [];
    const lastStep = rowsInfo.substeps[rowsInfo.substeps.length - 1];
    const currentStepArray = rowsInfo.substeps[rowsInfo.currentStep];

    // fixedRows[i] = true ako je row na svojoj finalnoj poziciji
    return currentStepArray.map((rowId, index) => rowId === lastStep[index]);
  }, [rowsInfo]);
  const fixedColumns = useMemo(() => {
    if (!columnsInfo.substeps.length) return [];

    const lastStep = columnsInfo.substeps[columnsInfo.substeps.length - 1];
    const currentStepArray = columnsInfo.substeps[columnsInfo.currentStep];

    return currentStepArray.map(
      (colId, index) => colId === lastStep[index]
    );
  }, [columnsInfo]);


  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full px-6">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl py-6 shadow-xl">
          {/*<h3 className="text-xl font-bold text-white mb-4 text-center">DT Matrix</h3>*/}

          <div
            className="grid gap-2 justify-center"
            style={{ gridTemplateColumns: `64px repeat(${cols}, 64px)` }}
          >
            {/* Top-left corner */}
            <div />

            {/* Column headers */}
            {columnHeaders.map((header, c) => (
              <motion.div
                key={header.id}
                layout
                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                className={`flex items-center justify-center rounded-md border border-gray-700/50
      ${fixedColumns[c] ? 'bg-green-600 text-white' : 'bg-gray-800/30 text-gray-300'}`}
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
                  transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                  className={`flex items-center transition-colors ease-in duration-300 justify-center text-gray-300 rounded-md border border-gray-700/50
                    ${fixedRows[r] ? 'bg-green-600 text-white' : 'bg-gray-800/30'}`}
                  style={{ width: 64, height: 64 }}
                >
                  {rowHeaders[r].label}
                </motion.div>

                {/* Tiles */}
                {row.tiles.map(tile => (
                  <motion.div
                    key={tile.id}
                    layout
                    transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                    className={`flex items-center justify-center rounded-lg font-mono text-xl border font-bold transition-colors duration-300 ease-out border-gray-700/50 ${
                      tile.value === ' ' && activeStep == '0' ? 'bg-gray-800/50 text-gray-600' : 'bg-blue-600 text-white border-blue-400 shadow-md'
                    }`}
                    style={{ width: 64, height: 64 }}
                  >
                    {tile.value === ' ' ? 'X' : tile.value}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
