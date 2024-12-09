import { Request, Response, NextFunction } from "express";
import xss from "xss";

// Middleware to sanitize input
const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.body) {
    for (let key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  if (req.query) {
    for (let key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = xss(req.query[key] as string);
      }
    }
  }

  if (req.params) {
    for (let key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  next();
};

export default sanitizeInput;
