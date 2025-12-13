export function animateColumnPermutation(
  permutation,
  container,
  duration = 500
) {
  if (!container) return;

  const tiles = Array.from(container.querySelectorAll('.tile'));
  if (tiles.length === 0) return;

  // inverse permutation
  const inverse = new Array(permutation.length);
  permutation.forEach((oldCol, newCol) => {
    inverse[oldCol] = newCol;
  });

  // grupisanje po kolonama
  const columns = {};
  tiles.forEach(tile => {
    const col = Number(tile.dataset.col);
    if (Number.isNaN(col)) return; // ⬅️ zaštita
    if (!columns[col]) columns[col] = [];
    columns[col].push(tile);
  });

  // širina kolone
  const rect = tiles[0].getBoundingClientRect();
  const gap =
    tiles.length > 1
      ? tiles[1].getBoundingClientRect().left - rect.right
      : 0;

  const columnWidth = rect.width + gap;

  Object.entries(columns).forEach(([oldCol, colTiles]) => {
    const from = Number(oldCol);
    const to = inverse[from];

    if (to === undefined) return; // ⬅️ zaštita

    const dx = (to - from) * columnWidth;

    colTiles.forEach(tile => {
      tile.style.transition = `transform ${duration}ms ease`;
      tile.style.transform = `translateX(${dx}px)`;
    });
  });

  setTimeout(() => {
    tiles.forEach(tile => {
      tile.style.transition = '';
      tile.style.transform = '';
    });
  }, duration);
}
