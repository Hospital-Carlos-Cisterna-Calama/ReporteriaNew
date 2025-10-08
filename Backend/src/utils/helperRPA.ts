export function fechaStr(d: string | Date | null | undefined): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function convertirFecha(dateLike: string, endOfDay = false): string {
  // Detectar si viene en formato DD/MM/YYYY
  const formatoDDMMYYYY = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateLike.match(formatoDDMMYYYY);
  
  let fechaISO: string;
  
  if (match) {
    // Convertir DD/MM/YYYY a YYYY-MM-DD
    const [, dia, mes, anio] = match;
    fechaISO = `${anio}-${mes}-${dia}`;
  } else {
    // Ya viene en formato YYYY-MM-DD o con hora
    fechaISO = dateLike;
  }
  
  // Si ya tiene hora, solo reemplazar T por espacio
  const hasTime = /\d{2}:\d{2}/.test(fechaISO);
  if (hasTime) return fechaISO.replace('T', ' ');
  
  // Agregar hora según sea inicio o fin del día
  return endOfDay ? `${fechaISO} 23:59:59.997` : `${fechaISO} 00:00:00.000`;
}
