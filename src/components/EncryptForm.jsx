import React, {useEffect, useState} from "react";
import {
  encryptDoubleTransposition,
  decryptDoubleTransposition,
  validateConfig} from "../crypto/doubleTransposition"
function EncryptForm() {

  const [plainText, setPlainText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState(true);

  const [config, setConfig] = useState({
    mode: "encrypt", // encrypt | decrypt
    uppercase: false,
    removeSpaces: false,

    rowKey: "",
    columnKey: "",
    transpositionOrder: "rows-first", // rows-first | cols-first

    paddingStrategy: "fixed", // fixed | random | repeat
    paddingChar: "X",
  });

  const updateConfig = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  useEffect(() => {
    if(!plainText || !result) return;

    const temp = plainText;
    setPlainText(result);
    setResult(temp);

  }, [mode]);


  useEffect(() => {
    console.log(config);
  },[config]);


  const handleProcess = () => {
    console.log('handleprocess')
    let resultx;
    if(config.mode === "encrypt") {
      resultx = encryptDoubleTransposition(plainText, config);
    }
    else{

      resultx = decryptDoubleTransposition(plainText, config);
    }
    setResult(resultx);

  };

  return (
    <div className="flex flex-col min-w-[800px]">
      {/* Main card */}
      <div className="flex px-6 pt-6 items-center justify-center">
        <div className="w-full bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Encrypt / Decrypt
            </h2>

            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => {
                  updateConfig("mode", "encrypt");
                  setMode(!mode);
                }}
                className={`px-4 py-1 text-sm transition-colors ${
                  config.mode === "encrypt"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                Encrypt
              </button>
              <button
                onClick={() => {
                  updateConfig("mode", "decrypt");
                  setMode(!mode);
                }}
                className={`px-4 py-1 text-sm transition-colors ${
                  config.mode === "decrypt"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                Decrypt
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <label className="block text-sm text-gray-300 mb-1">
                  {config.mode === "encrypt" ? "Plain text" : "Cipher text"}
                </label>
                <label className="block text-sm text-gray-300 mb-1">
                  len: {plainText.length.toLocaleString()}
                </label>
              </div>

              <textarea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                rows={6}
                className="w-full text-gray-200 bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                {config.mode === "encrypt"
                  ? "Encrypted text"
                  : "Decrypted text"}
              </label>
              <textarea
                value={result}
                readOnly
                rows={6}
                className="w-full text-gray-300 bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleProcess}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {config.mode === "encrypt" ? "Encrypt" : "Decrypt"}
          </button>
        </div>
      </div>

      {/* Encryption settings */}
      <div className="mt-6 px-6 pt-4">
        <h3 className="text-md border-t pt-2 font-semibold border-gray-700/50 text-gray-300 mb-3">
          Encryption settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Rows permutation key
            </label>
            <input
              type="text"
              value={config.rowKey}
              onChange={(e) => updateConfig("rowKey", e.target.value)}
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Columns permutation key
            </label>
            <input
              type="text"
              value={config.columnKey}
              onChange={(e) => updateConfig("columnKey", e.target.value)}
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Padding
            </label>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={config.paddingStrategy}
                onChange={(e) =>
                  updateConfig("paddingStrategy", e.target.value)
                }
                className="bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
              >
                <option value="fixed">Fixed character</option>
                <option value="random">Random characters</option>
                <option value="repeat">Repeat plaintext</option>
              </select>

              <input
                type="text"
                maxLength={1}
                value={
                  config.paddingStrategy === "fixed"
                    ? config.paddingChar
                    : ""
                }
                onChange={(e) =>
                  updateConfig("paddingChar", e.target.value)
                }
                disabled={config.paddingStrategy !== "fixed"}
                className={`px-2 py-1 rounded border ${
                  config.paddingStrategy === "fixed"
                    ? "bg-gray-800/60 text-gray-200 border-gray-700"
                    : "bg-gray-800/30 text-gray-500 border-gray-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text preprocessing */}
      <div className="mt-4 px-6">
        <h3 className="text-md font-semibold text-gray-300 mb-3">
          Text preprocessing
        </h3>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.uppercase}
              onChange={(e) =>
                updateConfig("uppercase", e.target.checked)
              }
              className="w-4 h-4"
            />
            Convert to uppercase
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.removeSpaces}
              onChange={(e) =>
                updateConfig("removeSpaces", e.target.checked)
              }
              className="w-4 h-4"
            />
            Remove spaces
          </label>
        </div>
      </div>
    </div>
  );

}

export default EncryptForm;
