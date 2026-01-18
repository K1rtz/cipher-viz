export function classicEncrypt(
  text,
  rows,
  cols,
  keyPairs,
  paddingStrategy = "fixed",
  paddingChar = "X",
) 
{


    console.log('plainText', text)
    console.log('rowsLength:', rows)
    console.log('colsLength:', cols)

  const size = rows * cols;

  const padded = applyPadding(text, size, paddingStrategy, paddingChar);

  const matrix = padded.split("");

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

  let result = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const realRow = rowMap[r];
      const realCol = colMap[c];
      result += matrix[realRow * cols + realCol];
    }
  }

    return result;

}

function applyPadding(text, targetLength, strategy, paddingChar = "X") {
    console.log(text)
  if (text.length >= targetLength) return text.slice(0, targetLength);

  let result = text;
  let i = 0;

  while (result.length < targetLength) {
    if (strategy === "fixed") {
      result += paddingChar;
    } 
    else if (strategy === "random") {
      result += getRandomChar();
    } 
    else if (strategy === "repeat") {
      result += text[i % text.length];
      i++;
    }
  }

  return result;
}

function getRandomChar() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

