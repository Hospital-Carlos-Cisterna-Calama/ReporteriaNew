import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validateSchema = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req.method === 'GET' ? req.query : req.body;

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(
        AppError.badRequest(
          'Error de validación',
          error.details.map(d => d.message)
        )
      );
    }

    if (req.method === 'GET') {
      req.query = value;
      (req as any).validated = { ...(req as any).validated, query: value };
    } else {
      req.body = value;
      (req as any).validated = { ...(req as any).validated, body: value };
    }

    next();
  };
};

export const validateParamSchema = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false, stripUnknown: true, convert: true });
    if (error)
      return next(
        AppError.badRequest(
          'Error de validación en parámetros',
          error.details.map(d => d.message)
        )
      );
    req.params = value;
    (req as any).validated = { ...(req as any).validated, params: value };
    next();
  };
};

// validateSearchQuery removido por no existir schema específico actualmente

export const validateQuerySchema = (schema: Joi.Schema) => (req: Request, _res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });
  if (error)
    return next(
      AppError.badRequest(
        'Query inválida',
        error.details.map((d: any) => d.message)
      )
    );
  req.query = value;
  (req as any).validated = { ...(req as any).validated, query: value };
  next();
};
