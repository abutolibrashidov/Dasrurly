import { ZodError } from 'zod';

export const errorMiddleware = (err, req, res, next) => {
  // Zod validation error → clean field-level messages
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      fields: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Known HTTP errors (thrown manually with err.status)
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Unexpected errors — don't leak stack in production
  console.error(err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};
