export function fechaStr(d: string | Date | null | undefined): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function convertirFecha(dateLike: string, endOfDay = false): string {
  // Espera 'YYYY-MM-DD' o 'YYYY-MM-DD HH:mm:ss[.fff]'
  const hasTime = /\d{2}:\d{2}/.test(dateLike);
  if (hasTime) return dateLike.replace('T', ' ');
  return endOfDay ? `${dateLike} 23:59:59.997` : `${dateLike} 00:00:00.000`;
}
