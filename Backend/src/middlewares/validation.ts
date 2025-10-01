import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ticketSearchSchema } from '../schemas/Tickets/validation-schemas';
import Joi from 'joi';

export const validateSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        message: 'Error de validación',
        details: error.details.map(d => d.message),
      });
      return;
    }
    next();
  };
};

export const validateParamSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      res.status(400).json({
        message: 'Error de validación en parámetros',
        details: error.details.map(d => d.message),
      });
      return;
    }
    next();
  };
};

export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const { error } = ticketSearchSchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};

/* ────────── NUEVO: query-string ────────── */
export const validateQuerySchema = (schema: Joi.Schema) => (req: Request, _res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    convert: true, // ⬅️  convierte '20' → 20
  });
  if (error) {
    _res.status(400).json({
      message: 'Query inválida',
      details: error.details.map(d => d.message),
    });
    return;
  }
  req.query = value;
  next();
};
