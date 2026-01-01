export function encryptDoubleTransposition(text, config) {
  const {
    rowKey,
    columnKey,
    paddingStrategy = 'fixed',
    paddingChar = 'X',
    uppercase = false,
    removeSpaces = false,
    transpositionOrder = 'rows-first', // 'rows-first' ili 'columns-first'
  } = config;


  function keyToNumberArray(key) {
    const chars = key.split('');

    const indexedChars = chars.map((char, idx) => ({ char, idx }));

    const sorted = [...indexedChars].sort((a, b) => {
      if (a.char < b.char) return -1;
      if (a.char > b.char) return 1;
      return a.idx - b.idx;
    });

    const orderMap = new Array(key.length);
    sorted.forEach((item, i) => {
      orderMap[item.idx] = i;
    });

    return orderMap;
  }


  // -------------------------
  // 1. Preprocess
  // -------------------------
  let cleanText = text;
  if (uppercase) cleanText = cleanText.toUpperCase();
  if (removeSpaces) cleanText = cleanText.replace(/\s/g, '');

  const rowPermutation = keyToNumberArray(rowKey)
  const colPermutation = keyToNumberArray(columnKey)

  const rows = rowPermutation.length;
  const cols = colPermutation.length;
  const size = rows * cols;
  console.log(rows, cols)

  const chars = new Array(size);
  for (let i = 0; i < size; i++) {
    if (i < cleanText.length) {
      chars[i] = cleanText[i];
    } else {
      if (paddingStrategy === 'fixed') {
        chars[i] = paddingChar;
      } else if (paddingStrategy === 'random') {
        chars[i] = String.fromCharCode(65 + (Math.random() * 26) | 0);
      } else if (paddingStrategy === 'repeat') {
        chars[i] = cleanText[i % cleanText.length];
      }
    }
  }

  // 2. Permutacije
  const tmp = new Array(size);

  if (transpositionOrder === 'rows-first') {
    // Row transposition
    for (let r = 0; r < rows; r++) {
      const srcRow = rowPermutation[r];
      const srcOffset = srcRow * cols;
      const dstOffset = r * cols;
      for (let c = 0; c < cols; c++) {
        tmp[dstOffset + c] = chars[srcOffset + c];
      }
    }

    // Column transposition
    for (let c = 0; c < cols; c++) {
      const srcCol = colPermutation[c];
      for (let r = 0; r < rows; r++) {
        chars[r * cols + c] = tmp[r * cols + srcCol];
      }
    }
  } else {
    // Columns first
    for (let c = 0; c < cols; c++) {
      const srcCol = colPermutation[c];
      for (let r = 0; r < rows; r++) {
        tmp[r * cols + c] = chars[r * cols + srcCol];
      }
    }

    for (let r = 0; r < rows; r++) {
      const srcRow = rowPermutation[r];
      const srcOffset = srcRow * cols;
      const dstOffset = r * cols;
      for (let c = 0; c < cols; c++) {
        chars[dstOffset + c] = tmp[srcOffset + c];
      }
    }
  }

  return chars.join('');
}
