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
const fechaSchema = Joi.string().pattern(FECHA_REGEX).required().messages({
  'string.empty': 'La fecha es requerida',
  'string.pattern.base': 'La fecha debe estar en formato DD/MM/YYYY',
  'any.required': 'La fecha es requerida',
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
  tipo: Joi.string().valid('A', 'U', 'M').required().messages({
    'any.only': 'El tipo debe ser "A" (Todos), "U" (Urgencias) o "M" (Maternidad)',
    'any.required': 'El tipo de reporte es requerido',
  }),
});

/**
 * Schema de validación para ReporteUrgenciaDoceHorasQuery
 * Solo requiere rango de fechas
 */
export const reporteUrgenciaDoceHorasSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
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
      'any.required': 'La fecha es requerida',
    })
    .label('Fecha'),
});

/**
 * Schema de validación para ReporteUrgeciaHosQuery
 * Tipos permitidos: 'H' (Hospitalizado), 'P' (Pabellón)
 */
export const reporteUrgeciaHosSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
  tipo: Joi.string().valid('H', 'P').required().messages({
    'any.only': 'El tipo debe ser "H" (Hospitalizado) o "P" (Pabellón)',
    'any.required': 'El tipo de hospitalización es requerido',
  }),
});

/**
 * Schema de validación para ReporteUrgIrasQuery
 * Tipos permitidos: 'M' (Maternidad), 'U' (Urgencias)
 */
export const reporteUrgIrasSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaTermino: fechaSchema.label('Fecha de término'),
  tipo: Joi.string().valid('M', 'U').required().messages({
    'any.only': 'El tipo debe ser "M" (Maternidad) o "U" (Urgencias)',
    'any.required': 'El tipo de reporte IRA es requerido',
  }),
});

export const hospitalizacionesPorServicioSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
  servicios: Joi.array().items(Joi.number().integer()).min(1).required().messages({
    'array.base': 'El campo servicios debe ser un arreglo de números',
    'array.min': 'Debe seleccionar al menos un servicio',
    'any.required': 'Debe indicar los servicios a consultar',
  }),
});

export const ingresosEgresosSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
  unidad: Joi.string().required().messages({ 'any.required': 'Debe indicar la unidad' }),
  filtro: Joi.string().valid('ingreso', 'egreso', 'todos').default('todos').messages({
    'any.only': 'El filtro debe ser "ingreso", "egreso" o "todos"',
  }),
});

export const intervencionPabellonSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),

});

export const irGrdSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
});

export const listaEsperaSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
  tipo: Joi.number().valid(1, 2).required().messages({
    'any.only': 'El tipo debe ser 1 (Solicitud) o 2 (Realización)',
  }),
});

export const procedimientosSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
  PadreEsp: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'El ID de especialidad debe ser un texto válido'
    })
    .label('ID de Especialidad'),
  selectEspec: Joi.string()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'El ID de sub especialidad debe ser un número',
      'number.integer': 'El ID de sub especialidad debe ser un número entero'
    })
    .label('ID de Sub Especialidad')
});

// ============================================================================
// SCHEMAS DE VALIDACIÓN PARA ESPECIALIDADES
// ============================================================================

/**
 * Schema de validación para obtener sub especialidades por especialidad
 */
export const subEspecialidadesSchema = Joi.object({
  especialidadId: Joi.string()
    .required()
    .messages({
      'string.empty': 'El ID de especialidad es requerido',
      'any.required': 'El ID de especialidad es requerido'
    })
    .label('ID de Especialidad')
});

export const pacientesHospitalizadosSchema = Joi.object({
  fechaInicio: fechaSchema.label('Fecha de inicio'),
  fechaFin: fechaSchema.label('Fecha de término'),
});
