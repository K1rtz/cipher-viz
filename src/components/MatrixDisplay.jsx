import React, {useEffect, useState, useMemo, useRef} from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectActiveStep,
  selectPlainText,
  selectKeyRaw,
  selectCurrentStep,
  selectRowsInfo,
  selectColumnsInfo,
  selectStepChange,
  selectHighlightStep,
} from './../store/selectors/stepInfoSelector.js';
import {setRowsAdvanceNext, setColumnsAdvanceNext} from './../store/reducers/stepInfoReducer'

export default function MatrixDisplay({ rows = 7, cols = 7 }) {

  const activeStep = useSelector(selectActiveStep);
  const plainText = useSelector(selectPlainText);
  const rowsInfo = useSelector(selectRowsInfo);
  const columnsInfo = useSelector(selectColumnsInfo);
  const currentStep = useSelector(selectCurrentStep);
  const keyRaw = useSelector(selectKeyRaw);
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

  const highlightStep = useSelector(selectHighlightStep);

  const highlightedPositions = useMemo(() => {
    if (highlightStep == null) return null;

    const x = keyRaw[highlightStep * 2];
    const y = keyRaw[highlightStep * 2 + 1];

    if (x == null || y == null) return null;

    return [Number(x), Number(y)];
  }, [highlightStep, keyRaw]);

  const stepChange = useSelector(selectStepChange);

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
  const getPair = (step) => {
    const i = step * 2;
    return [
      Number(keyRaw[i]),
      Number(keyRaw[i + 1]),
    ];
  };

  const applyStep = (step) => {
    if (step < 0) return;
    const [x, y] = getPair(step);

    step % 2 === 0
      ? swapRowsByPosition(x, y)
      : swapColumnsByPosition(x, y);
  };

  const undoStep = (step) => {
    if (step < 0) return;
    const [x, y] = getPair(step);

    // swap je involucija → isto kao apply
    step % 2 === 0
      ? swapRowsByPosition(x, y)
      : swapColumnsByPosition(x, y);
  };

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    console.log('Desil se promena, current stpe je:' + currentStep );
    const prev = prevStepRef.current;
    prevStepRef.current = currentStep;

    if (prev === currentStep) return;

    if (currentStep > prev) {
      applyStep(currentStep);
    } else {
      undoStep(prev);
    }

  },[currentStep])




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



  useEffect(() => {
    console.log('xdd')
    console.log(rowsInfo.advanceNext);
    console.log(rowsInfo.substeps.length);

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

  const isRowStep = highlightStep % 2 === 0;


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
            {columnHeaders.map((header, c) => {
              const isHighlighted =
                !isRowStep && highlightedPositions?.includes(c) && activeStep === 1;

              return (
                <motion.div
                  key={header.id}
                  layout
                  animate={{
                      backgroundColor: isHighlighted
                      ? 'rgba(59,130,246,0.35)' // blue highlight
                      : fixedColumns[c] && activeStep > 1
                        ? 'rgb(15,127,55)'
                        : 'rgba(31, 41, 55, 0.3)',
                    color: isHighlighted ? '#fff' : fixedColumns[c] ? '#fff' : '#d1d5db',
                  }}
                  transition={{
                    backgroundColor: { duration: 0.4 },
                    layout: { type: 'spring', stiffness: 80, damping: 20 }
                  }}
                  className="flex items-center justify-center rounded-md border border-gray-700/50"
                  style={{ width: 64, height: 64 }}
                >
                  {header.label}
                </motion.div>
              );
            })}

            {/* Rows */}
            {matrixRows.map((row, r) => {

              const isHighlighted = isRowStep && highlightedPositions?.includes(r) && activeStep === 1;

              return (
              <React.Fragment key={row.rowId}>
                {/* Row header */}
                <motion.div
                  layout
                  animate={{
                    backgroundColor: isHighlighted
                      ? 'rgba(59,130,246,0.35)'
                      : fixedRows[r] && activeStep > 0
                        ? 'rgb(15,127,55)'
                        : 'rgba(31, 41, 55, 0.3)',
                    color: isHighlighted ? '#fff' : fixedRows[r] ? '#fff' : '#d1d5db',
                  }}
                  transition={{
                    backgroundColor: { duration: 0.6 },
                    color: { duration: 0.6 },
                    layout: { type: 'spring', stiffness: 80, damping: 20 },
                  }}
                  className="flex items-center justify-center bg-gray-800/30 rounded-md border border-gray-700/50"
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
                    className={`flex items-center justify-center rounded-lg font-mono text-xl border font-bold transition-colors duration-300 ease-out border-gray-700/50 ${
                      tile.value === ' ' && activeStep == '0' ? 'bg-gray-800/50 text-gray-600' : 'bg-blue-800/90 text-white border-blue-400 shadow-md'
                    }`}
                    style={{ width: 64, height: 64 }}
                  >
                    {tile.value === ' ' ? 'X' : tile.value}
                  </motion.div>
                ))}
              </React.Fragment>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
