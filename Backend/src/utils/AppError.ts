export class AppError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status = 500, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(msg: string, details?: any) { return new AppError(msg, 400, 'BAD_REQUEST', details); }
  static notFound(msg: string, details?: any) { return new AppError(msg, 404, 'NOT_FOUND', details); }
  static conflict(msg: string, details?: any) { return new AppError(msg, 409, 'CONFLICT', details); }
  static unauthorized(msg: string, details?: any) { return new AppError(msg, 401, 'UNAUTHORIZED', details); }
  static forbidden(msg: string, details?: any) { return new AppError(msg, 403, 'FORBIDDEN', details); }
}