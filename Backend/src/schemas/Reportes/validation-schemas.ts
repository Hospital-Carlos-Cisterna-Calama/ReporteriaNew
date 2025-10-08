import Joi from 'joi';

// ============================================================================
// VALIDACIÓN DE FORMATO DE FECHA (DD/MM/YYYY)
// ============================================================================

/**
 * Expresión regular para validar formato DD/MM/YYYY
 * Acepta fechas válidas del 01/01/1900 al 31/12/2099
 */
const FECHA_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;

/**
 * Schema base para validación de fechas en formato DD/MM/YYYY
 */
const fechaSchema = Joi.string()
  .pattern(FECHA_REGEX)
  .required()
  .messages({
    'string.empty': 'La fecha es requerida',
    'string.pattern.base': 'La fecha debe estar en formato DD/MM/YYYY',
    'any.required': 'La fecha es requerida'
  });

// ============================================================================
// SCHEMAS DE VALIDACIÓN PARA REPORTES DE URGENCIA
// ============================================================================

/**
 * Schema de validación para ReporteUrgenciaQuery
 * Tipos permitidos: 'A' (All/Todos), 'U' (Urgencias), 'M' (Maternidad)
 */
export const reporteUrgenciaSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
  tipo: Joi.string()
    .valid('A', 'U', 'M')
    .required()
    .messages({
      'any.only': 'El tipo debe ser "A" (Todos), "U" (Urgencias) o "M" (Maternidad)',
      'any.required': 'El tipo de reporte es requerido'
    })
});

/**
 * Schema de validación para ReporteUrgenciaDoceHorasQuery
 * Solo requiere rango de fechas
 */
export const reporteUrgenciaDoceHorasSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término')
});

/**
 * Schema de validación para ResporteUrgeciaCatQuery
 * Formato requerido: YYYY-MM (año-mes)
 * Ejemplo: "2025-08" para agosto de 2025
 */
export const reporteUrgeciaCatSchema = Joi.object({
  fecha: Joi.string()
    .pattern(/^(19|20)\d\d-(0[1-9]|1[012])$/)
    .required()
    .messages({
      'string.empty': 'La fecha es requerida',
      'string.pattern.base': 'La fecha debe estar en formato YYYY-MM (ejemplo: 2025-08)',
      'any.required': 'La fecha es requerida'
    })
    .label('Fecha')
});

/**
 * Schema de validación para ReporteUrgeciaHosQuery
 * Tipos permitidos: 'H' (Hospitalizado), 'P' (Pabellón)
 */
export const reporteUrgeciaHosSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
  tipo: Joi.string()
    .valid('H', 'P')
    .required()
    .messages({
      'any.only': 'El tipo debe ser "H" (Hospitalizado) o "P" (Pabellón)',
      'any.required': 'El tipo de hospitalización es requerido'
    })
});

/**
 * Schema de validación para ReporteUrgIrasQuery
 * Tipos permitidos: 'M' (Maternidad), 'U' (Urgencias)
 */
export const reporteUrgIrasSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
  tipo: Joi.string()
    .valid('M', 'U')
    .required()
    .messages({
      'any.only': 'El tipo debe ser "M" (Maternidad) o "U" (Urgencias)',
      'any.required': 'El tipo de reporte IRA es requerido'
    })
});

// PPV Reportes

export const hospitalizacionesPorServicioSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required().messages({
    'string.empty': 'Debe indicar la fecha de inicio',
    'any.required': 'La fecha de inicio es obligatoria',
  }),
  fechaFin: Joi.string().isoDate().required().messages({
    'string.empty': 'Debe indicar la fecha de término',
    'any.required': 'La fecha de término es obligatoria',
  }),
  especialidad: Joi.string().optional().allow(null, '').messages({
    'string.base': 'La especialidad debe ser un texto válido',
  }),
});

export const ingresosEgresosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  unidad: Joi.string().required().messages({ 'any.required': 'Debe indicar la unidad' }),
  filtro: Joi.string().valid('ingreso', 'egreso', 'todos').default('todos').messages({
    'any.only': 'El filtro debe ser "ingreso", "egreso" o "todos"',
  }),
});

export const intervencionPabellonSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  pabellonId: Joi.string().optional().allow(null, ''),
});

export const irGrdSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
});

export const listaEsperaSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  tipo: Joi.number().valid(1, 2).required().messages({
    'any.only': 'El tipo debe ser 1 (Solicitud) o 2 (Realización)',
  }),
});

export const pacientesHospitalizadosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  servicioId: Joi.string().optional().allow(null, ''),
});

export const procedimientosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  especialidad: Joi.string().required().messages({
    'any.required': 'Debe indicar la especialidad',
  }),
});
