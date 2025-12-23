export function validateConfig(config) {
  if (!config.inputText?.trim()) {
    return "Input text is empty";
  }

  if (config.rowKey.length !== Number(config.numberOfRows)) {
    return "Row key length mismatch";
  }

  if (config.columnKey.length !== Number(config.numberOfCols)) {
    return "Column key length mismatch";
  }

  return null;
}