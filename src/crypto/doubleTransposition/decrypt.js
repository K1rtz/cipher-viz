export function decryptDoubleTransposition(cipherText, config) {
  const {
    rowKey,
    columnKey,
    transpositionOrder = 'rows-first', //TODO fix
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

  // Pretvori ključeve u permutacije
  const rowPermutation = keyToNumberArray(rowKey);
  const colPermutation = keyToNumberArray(columnKey);

  const rows = rowPermutation.length;
  const cols = colPermutation.length;
  const size = rows * cols;

  // Napuni matricu sa cipherText
  const chars = cipherText.split('');

  const tmp = new Array(size);

  if (transpositionOrder === 'rows-first') {
    // Obrnuta column transposition
    for (let c = 0; c < cols; c++) {
      const srcCol = colPermutation[c];
      for (let r = 0; r < rows; r++) {
        tmp[r * cols + srcCol] = chars[r * cols + c];
      }
    }

    // Obrnuta row transposition
    for (let r = 0; r < rows; r++) {
      const srcRow = rowPermutation[r];
      const dstOffset = srcRow * cols;
      const srcOffset = r * cols;
      for (let c = 0; c < cols; c++) {
        chars[dstOffset + c] = tmp[srcOffset + c];
      }
    }
  } else {
    // Columns-first
    // Obrnuta row transposition
    for (let r = 0; r < rows; r++) {
      const srcRow = rowPermutation[r];
      const srcOffset = srcRow * cols;
      const dstOffset = r * cols;
      for (let c = 0; c < cols; c++) {
        tmp[srcOffset + c] = chars[dstOffset + c];
      }
    }

    // Obrnuta column transposition
    for (let c = 0; c < cols; c++) {
      const srcCol = colPermutation[c];
      for (let r = 0; r < rows; r++) {
        chars[r * cols + c] = tmp[r * cols + srcCol];
      }
    }
  }

  return chars.join('');
}
