import React, { useState } from "react";

function EncryptForm() {
  const [mode, setMode] = useState('encrypt'); // encrypt | decrypt
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleProcess = () => {
    // placeholder logika
    const result = inputText.split('').reverse().join('');
    setOutputText(result);
  };

  return (
    <div className="flex flex-col min-w-[800px] ">
      {/* Main card */}
      <div className="flex px-6 pt-6 items-center justify-center">
        <div className="w-full  bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Encrypt / Decrypt
            </h2>

            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setMode('encrypt')}
                className={`px-4 py-1 text-sm transition-colors ${
                  mode === 'encrypt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`px-4 py-1 text-sm transition-colors ${
                  mode === 'decrypt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                Decrypt
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                {mode === 'encrypt' ? 'Plain text' : 'Cipher text'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="w-full text-gray-200 bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Output */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                {mode === 'encrypt' ? 'Encrypted text' : 'Decrypted text'}
              </label>
              <textarea
                value={outputText}
                readOnly
                rows={6}
                className="w-full text-gray-300 bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleProcess}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6  px-6  pt-4">
        <h3 className="text-md border-t pt-2 font-semibold border-gray-700/50 text-gray-300 mb-3">
          Encryption settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Number of rows
            </label>
            <input
              type="text"
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Number of columns
            </label>
            <input
              type="text"
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Rows permutation key
            </label>
            <input
              type="text"
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              placeholder="10452376"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Columns permutation key
            </label>
            <input
              type="text"
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              placeholder="10743256"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Transposition order
            </label>
            <select className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700">
              <option>Rows → Columns</option>
              <option>Columns → Rows</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Padding character
            </label>
            <input
              type="text"
              maxLength={1}
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              placeholder="X"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EncryptForm;
