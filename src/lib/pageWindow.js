/** Page numbers to show, with "gap" markers where pages are skipped. */
export function getPageWindow(page, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const numbers = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);

  const items = [];
  numbers.forEach((n, index) => {
    if (index > 0 && n - numbers[index - 1] > 1) items.push(`gap-${n}`);
    items.push(n);
  });
  return items;
}
