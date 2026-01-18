import React, {useEffect, useState} from "react";
import {
  classicEncrypt,
  classicDecrypt,
  encryptDoubleTransposition,
  decryptDoubleTransposition,
  validateConfig} from "../crypto/doubleTransposition"
import { div } from "framer-motion/client";

function EncryptForm() {

  const [plainText, setPlainText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState(true);

  const [config, setConfig] = useState({
    mode: "encrypt", // encrypt | decrypt
    encodeMode: "Text",
    uppercase: false,
    removeSpaces: false,


    encryptionKey: "",
    rawKey:"",
    columnsLength: "",
    rowsLength: "",

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


  const handleProcess = () => { //OVDE POZIVANJE FUNKCIJA
    //CHECK VALIDY OF SETTINGS BEFORE WE PROCEED FURTHER
    //PERFORM TEXT PROCESSING ON INPUT?
    //CONTINUE ON WITH FUNCTION


    const keyTest = parseAndValidateKey(encryptionKey, config.rowsLength, config.columnsLength);
    let result
    if(keyTest.valid){
      
      result = config.mode === 'encrypt' ? classicEncrypt(plainText, Number(config.rowsLength), Number(config.columnsLength), keyTest.numbers, config.paddingStrategy, config.paddingChar)
      :  classicDecrypt(plainText, Number(config.rowsLength), Number(config.columnsLength), keyTest.numbers)
      if(settingsError){
        setSettingsError('')
      }
    }else{
      console.error('error:', keyTest.error)
      setSettingsError(keyTest.error)
    }

    //DA LI JE ROW*COLUMN > DUZINE PLAINTEXTA
    //DA LI ROW/COLUMN DUZINA ODGOVARA VREDNOSTIMA ROW I COL


    // console.log('handleprocess')
    // let resultx;
    // if(config.mode === "encrypt") {
    //   resultx = encryptDoubleTransposition(plainText, config);
    // }
    // else{

    //   resultx = decryptDoubleTransposition(plainText, config);
    // }
    // setResult(resultx);
    console.log('paddingStart:', config.paddingStrategy)
    console.log('paddingChar:', config.paddingChar)
    console.log('plainText', plainText)
    console.log('rowsLength:', Number(config.rowsLength))
    console.log('colsLength:', Number(config.columnsLength))
    // let result = classicEncrypt(plainText, Number(config.rowsLength), Number(config.columnsLength), [0,1,1,2,4,3,2,4,6,0,1,2],
    // config.paddingStrategy, config.paddingChar)
    // let result = classicDecrypt('LE SE LROZBALEISA CUS NRAGA.I SE KO.ZRA.BO LE SIS', Number(config.rowsLength), Number(config.columnsLength), [0,1,1,2,4,3,2,4,6,0,1,2])
    console.log(result)

    setResult(result)
    console.log(encryptionKey)
  };


const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.endsWith(".txt")) {
    alert("Only .txt files are allowed");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    let text = event.target.result;

    // optional preprocessing (poštujemo config)
    if (config.removeSpaces) {
      text = text.replace(/\s+/g, "");
    }

    if (config.uppercase) {
      text = text.toUpperCase();
    }

    setPlainText(text);
    setResult(""); // resetuj rezultat jer je novi input
  };

  reader.readAsText(file);
};
const handleDownload = () => {
  if (!result) return;

  const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  const suffix = config.mode === "encrypt" ? "encrypted" : "decrypted";
  a.download = `double-transposition-${suffix}.txt`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
const [encryptionKey, setEncryptionKey] = useState("");

  // useEffect(() => {
    // console.log('raw:', encryptionKey);
    // console.log('formatted:', formatAsPairs(encryptionKey));
  // }, [encryptionKey]);



  const [encryptionType, setEncryptionType] = useState("classic");
  const encryptionButtonClass = (type) =>
    `text-xs px-3 py-1 rounded cursor-pointer transition-all duration-200
    ${
      encryptionType === type
        ? "bg-green-600 text-white shadow-md scale-100 font-semibold"
        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
    }`;

  
  
  function parseAndValidateKey(text, numRows, numCols) {
    // regex za hvatanje parova u formatu (x,y)
    const pairRegex = /\(\s*\d+\s*,\s*\d+\s*\)/g;
    const matches = text.match(pairRegex);


    if(Number(numRows) * Number(numCols) < plainText.length){
      return {valid: false, error: `Matrix is too small to handle this amount of data`}
    }

    console.log(matches.join("") !== text.replace(/\s+/g, ""))
    // ako nema poklapanja ili se ne poklapa ceo string → neispravan format
    if (!matches || matches.join(",") !== text.replace(/\s+/g, "")) {
      return { valid: false, error: "Invalid key format." };
    }


    // parsiraj parove u niz brojeva
    const numbers = [];
    matches.forEach(pair => {
      const [a, b] = pair.replace(/[()]/g, "").split(",").map(n => parseInt(n, 10));
      numbers.push(a, b);
    });

    // validacija: parovi se smenjuju redovi/kolone
    for (let i = 0; i < numbers.length; i += 2) {
      const a = numbers[i];
      const b = numbers[i + 1];
      const isRowSwap = (i / 2) % 2 === 0; // 0.,2.,4. par → redovi; 1.,3.,5. → kolone

      if (isRowSwap) {
        if (a >= numRows || b >= numRows) {
          return { valid: false, error: `Row swap (${a},${b}) is out of bounds [0-${numRows - 1}]` };
        }
      } else {
        if (a >= numCols || b >= numCols) {
          return { valid: false, error: `Column swap (${a},${b}) is out of bounds [0-${numCols - 1}]` };
        }
      }
    }

    return { valid: true, numbers };
  }

    const [settingsError, setSettingsError] = useState("");

    return (
    <div className="flex flex-col min-w-[800px]">
      {/* Main card */}
      <div className=" flex px-6 pt-6 items-center justify-center">
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
                  setResult("")
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
                  setResult("")
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
              <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-300">
                {config.mode === "encrypt" ? "Plain text" : "Cipher text"}
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  len: {plainText.length.toLocaleString()}
                </span>

                <label className="text-xs px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white cursor-pointer">
                  Upload .txt
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

              <textarea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                rows={6}
                className="w-full text-gray-200 bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-300">
                  {config.mode === "encrypt"
                    ? "Encrypted text"
                    : "Decrypted text"}
                </label>

                <button
                  onClick={handleDownload}
                  disabled={!result}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    result
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  Download .txt
                </button>
              </div>

              <textarea
                value={result}
                readOnly
                rows={6}
                className="focus:outline-none cursor-auto w-full text-gray-300 bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700"
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

      <div className="text-center text-red-500 text-sm font-semibold mt-3 h-6">
       <div className={`${settingsError ? 'block' : 'invisible'}`}>{settingsError}</div> 
      </div>

      {/* Encryption settings -----------------------------------------------------------------------------*/}
      <div className="mt-3 px-6 pt-2">

        <h3 className="text-md border-t pt-2 font-semibold border-gray-700/50 text-gray-300 mb-1 ">
          Encryption settings
        </h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setEncryptionType("classic")}
            className={encryptionButtonClass("classic")}
          >
            Classic
          </button>

          <button
            onClick={() => setEncryptionType("shifting-xor")}
            className={encryptionButtonClass("shifting-xor")}
          >
            Shifting XOR
          </button>

          <button
            onClick={() => setEncryptionType("chained-xor")}
            className={encryptionButtonClass("chained-xor")}
          >
            Chained XOR
          </button>
        </div>
          
        {/*ROWS AND COLUMNS LENGTH  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Rows length
            </label>
            <input
              type="text"
              value={config.rowsLength}
              onChange={(e) => updateConfig("rowsLength", e.target.value)}
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Columns length
            </label>
            <input
              type="text"
              value={config.columnsLength}
              onChange={(e) => updateConfig("columnsLength", e.target.value)}
              className="w-full bg-gray-800/60 text-gray-200 px-2 py-1 rounded border border-gray-700"
            />
          </div>
        </div>


        <div className="my-2 w-full">
          <label className="block text-xs text-gray-400 mb-1">
            Encryption key
          </label>
          <input
            type="text"
            disabled = {!config.columnsLength || !config.rowsLength}
            value={encryptionKey}
            // value={formatAsPairs(encryptionKey)}
            onChange={(e) =>{
                setEncryptionKey(e.target.value)
                // const digitsOnly = e.target.value.replace(/[^0-6]/g, '');
                // setEncryptionKey(digitsOnly)
            }}
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
              onChange={(e) =>{
                updateConfig("uppercase", e.target.checked)
                if(config.uppercase){
                  setPlainText(plainText.toLowerCase())
                }else{
                  setPlainText(plainText.toUpperCase())
                }
                
              }
                
              }
              className="w-4 h-4"
            />
            Convert to uppercase
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.removeSpaces}
              onChange={(e) =>{
                updateConfig("removeSpaces", e.target.checked)
                if(!config.removeSpaces){
                  setPlainText(plainText.replace(/\s+/g, ""))
                }else{

                }
              }
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
