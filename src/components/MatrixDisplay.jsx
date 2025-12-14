import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectActiveStep } from './../store/selectors/stepInfoSelector.js';
export default function MatrixDisplay({ rows = 7, cols = 7, tiles = [] }) {

  const activeStep = useSelector(selectActiveStep);
  useEffect(() => {
    // if(activeStep === 1){
    //   handleAnimateColumns()
    // }
    // if(activeStep === 2){
    //   handleAnimateRows()
    // }
  }, [activeStep]);





  const defaultTiles = Array.from({ length: rows * cols }, (_, i) => ({
    id: i,
    value: String.fromCharCode(65 + (i % 26)),
  }));

  const [matrixRows, setMatrixRows] = useState(
    Array.from({ length: rows }, (_, r) => ({
      id: r,
      tiles: tiles.length === rows * cols
        ? tiles.slice(r * cols, (r + 1) * cols).map((t, i) => ({ id: r*cols+i, value: t }))
        : defaultTiles.slice(r * cols, (r + 1) * cols),
    }))
  );

  const [columnHeaders, setColumnHeaders] = useState(
    Array.from({ length: cols }, (_, i) => ({ id: i, label: i }))
  );

  const [rowHeaders, setRowHeaders] = useState(
    Array.from({ length: rows }, (_, i) => ({ id: i, label: i }))
  );

  /* ---------- HANDLERS ---------- */

  // Permutacija kolona
  const handleAnimateColumns = () => {
    const permutation = [6, 5, 4, 3, 2, 1, 0];

    // Headeri kolona
    setColumnHeaders(prev => permutation.map(i => prev[i]));

    // Tile-ovi po kolonama u svakom redu
    setMatrixRows(prev =>
      prev.map(row => ({
        ...row,
        tiles: permutation.map(i => row.tiles[i]),
      }))
    );
  };

  // Permutacija redova
  const handleAnimateRows = () => {
    const permutation = [6, 5, 4, 3, 2, 1, 0];

    // Headeri redova
    setRowHeaders(prev => permutation.map(i => prev[i]));

    // Redovi
    setMatrixRows(prev => permutation.map(i => prev[i]));
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex mb-4">
        <button
          onClick={handleAnimateColumns}
          className="w-14 h-14 bg-red-300 rounded-lg mr-4"
        >
          ▶
        </button>
        <button
          onClick={handleAnimateRows}
          className="w-14 h-14 bg-blue-300 rounded-lg"
        >
          ⇅
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Matrix Visualization
          </h3>

          <div
            className="grid gap-2 justify-center"
            style={{
              gridTemplateColumns: `64px repeat(${cols}, 64px)`,
            }}
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
              <React.Fragment key={row.id}>
                {/* Row header */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  className="flex items-center justify-center text-gray-300 bg-gray-800/30 rounded-md border border-gray-700/50"
                  style={{ width: 64, height: 64 }}
                >
                  {rowHeaders[r].label}
                </motion.div>

                {/* Tile-ovi u ovom redu */}
                {row.tiles.map(tile => (
                  <motion.div
                    key={tile.id}
                    layout
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="flex items-center justify-center rounded-lg bg-gray-800 text-white font-mono text-lg border border-gray-700/50"
                    style={{ width: 64, height: 64 }}
                  >
                    {tile.value}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-400 text-center">
            Visual representation of the double transposition cipher
          </div>
        </div>
      </div>
    </div>
  );
}
