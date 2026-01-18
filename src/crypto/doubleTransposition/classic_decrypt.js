export function classicDecrypt(
  cipherText,
  rows,
  cols,
  keyPairs,
) {
  const size = rows * cols;
  if (cipherText.length !== size) {
    throw new Error("Cipher text length does not match matrix size");
  }


  const matrix = cipherText.split("");

  const rowMap = Array.from({ length: rows }, (_, i) => i);
  const colMap = Array.from({ length: cols }, (_, i) => i);

  let isRowSwap = true;

  for (let i = 0; i < keyPairs.length; i += 2) {
    const a = keyPairs[i];
    const b = keyPairs[i + 1];

    if (isRowSwap) {
      const r1 = a % rows;
      const r2 = b % rows;
      [rowMap[r1], rowMap[r2]] = [rowMap[r2], rowMap[r1]];
    } else {
      const c1 = a % cols;
      const c2 = b % cols;
      [colMap[c1], colMap[c2]] = [colMap[c2], colMap[c1]];
    }

    isRowSwap = !isRowSwap;
  }

  // 3️⃣ Invertujemo mapiranja
  const inverseRowMap = [];
  const inverseColMap = [];

  for (let i = 0; i < rows; i++) {
    inverseRowMap[rowMap[i]] = i;
  }

  for (let i = 0; i < cols; i++) {
    inverseColMap[colMap[i]] = i;
  }

  // 4️⃣ Rekonstrukcija plaintexta
  let result = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const encRow = inverseRowMap[r];
      const encCol = inverseColMap[c];
      result += matrix[encRow * cols + encCol];
    }
  }

  return result;
}