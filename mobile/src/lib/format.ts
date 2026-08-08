/** Rupee formatting. Prices are whole rupees everywhere in this codebase. */
export function inr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** "9 Aug 2026, 4:30 pm" — the format the storefront's order list uses. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Short order reference shown to customers — the full uuid is noise. */
export function orderRef(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}
