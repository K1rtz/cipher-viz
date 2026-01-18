export function xorDecrypt(
  hexText,
  rows,
  cols,
  keyPairs,
  xorKey,
  xorStrategy, // "chained" | "shifting"
) {
  // 1. hex -> bytes
  let bytes = hexToBytes(hexText);

  // 2. bytes -> matrix
  let matrix = bytesToMatrix(bytes, rows, cols);

  const rounds = keyPairs.length / 2;

  // 3. priprema xor ključeva po rundama (bitno za shifting)
  const xorKeys = [];
  let currentKey = xorKey & 0xff;

  for (let i = 0; i < rounds; i++) {
    xorKeys.push(currentKey);
    if (xorStrategy === "shifting") {
      currentKey = (currentKey + 3) % 256;
    }
  }

  // 4. dekripcija – unazad
  for (let r = rounds - 1; r >= 0; r--) {
    const i = r * 2;
    const a = keyPairs[i];
    const b = keyPairs[i + 1];

    const isRowSwap = r % 2 === 0;

    // prvo poništavamo swap
    if (isRowSwap) {
      swapRows(matrix, a, b);
    } else {
      swapCols(matrix, a, b);
    }

    // zatim XOR (isti kao u enkripciji)
    const flat = matrixToBytes(matrix);

    const xored =
      xorStrategy === "chained"
        ? chainedXorDecrypt(flat, xorKeys[r])
        : shiftingXor(flat, xorKeys[r]);

    matrix = bytesToMatrix(xored, rows, cols);
  }

  // 5. bytes -> text
  return bytesToText(matrixToBytes(matrix));
}

function chainedXorDecrypt(cipherBytes, key) {
  const out = new Uint8Array(cipherBytes.length);

  // prvi bajt
  out[0] = cipherBytes[0] ^ key;

  // ostali bajtovi
  for (let i = 1; i < cipherBytes.length; i++) {
    out[i] = cipherBytes[i] ^ cipherBytes[i - 1];
  }

  return out;
}


function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

export function xorEncrypt(
  text,
  rows,
  cols,
  keyPairs,
  paddingStrategy,
  paddingChar,
  xorKey,
  xorStrategy, // "chained" | "shifting"
) {

    const totalSize = rows * cols;

    let bytes = textToBytes(text);

    bytes = applyPadding(bytes, totalSize, paddingStrategy, paddingChar)

    let matrix = bytesToMatrix(bytes, rows, cols)

    let currentXorKey = xorKey & 0xff;

    //iteracije
    console.log(keyPairs)
    for (let i = 0; i < keyPairs.length; i+=2){
        const flat = matrixToBytes(matrix);
        const xored = xorStrategy === 'chained' ? chainedXor(flat, currentXorKey) : shiftingXor(flat, currentXorKey)
        if(xorStrategy === 'shifting'){
            currentXorKey = (currentXorKey + 3) % 256;
        }
        matrix = bytesToMatrix(xored, rows, cols)
        const a = keyPairs[i]
        const b = keyPairs[i + 1]
        const isRowSwap = (i/2)%2 === 0

        if(isRowSwap){
            swapRows(matrix, a , b)
        }else{
            swapCols(matrix, a, b)
        }
    }

    return bytesToHex(matrixToBytes(matrix))



}
//CHAINED XOR
function chainedXor(bytes, key) {
  const out = new Uint8Array(bytes.length);
  let prev = key;

  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ prev;
    prev = out[i];
  }

  return out;
}
//SHIFTING XOR
function shiftingXor(bytes, key) {
  const out = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ key;
  }

  return out;
}

//BYTES TO MATRIX
function bytesToMatrix(bytes, rows, cols) {
  const matrix = [];
  let k = 0;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(bytes[k++]);
    }
    matrix.push(row);
  }

  return matrix;
}
//MATRIX TO BYTES
function matrixToBytes(matrix) {
  return Uint8Array.from(matrix.flat());
}

//SWAP ROWS
function swapRows(matrix, r1, r2) {
  [matrix[r1], matrix[r2]] = [matrix[r2], matrix[r1]];
}
//SWAP COLS
function swapCols(matrix, c1, c2) {
  for (let r = 0; r < matrix.length; r++) {
    [matrix[r][c1], matrix[r][c2]] = [matrix[r][c2], matrix[r][c1]];
  }
}

//TEXT U BAJTOVE
function textToBytes(text) {
  return new TextEncoder().encode(text);
}
//BAJTOVI U HEX
function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

//PADDING
function applyPadding(bytes, totalSize, strategy, padChar) {
  if (bytes.length >= totalSize) return bytes;

  const out = Array.from(bytes);

  if (strategy === "fixed") {
    const padByte = padChar.charCodeAt(0);
    while (out.length < totalSize) out.push(padByte);
  }

  if (strategy === "random") {
    while (out.length < totalSize) {
      out.push(Math.floor(Math.random() * 256));
    }
  }

  if (strategy === "repeat") {
    let i = 0;
    while (out.length < totalSize) {
      out.push(bytes[i++ % bytes.length]);
    }
  }

  return Uint8Array.from(out);
}