import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export function rateLimitLogin(maxAttempts = 5, windowSec = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `login:${req.ip}`;
    
    const attempts = await redis.incr(key);

    if (attempts === 1) {
      await redis.expire(key, windowSec); // start TTL
    }

    if (attempts > maxAttempts) {
      return res.status(429).json({
        error: "Too many login attempts. Please wait a moment."
      });
    }

    next();
  };
}

export function rateLimitEmail(maxRequests = 3, windowSec = 300) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const email = req.body.email?.toLowerCase();
      if (!email) return next();
  
      const key = `forgot:${email}`;
      const count = await redis.incr(key);
  
      if (count === 1) {
        await redis.expire(key, windowSec);
      }
  
      if (count > maxRequests) {
        return res.status(429).json({
          error: "Too many reset-password requests. Please wait."
        });
      }
  
      next();
    };
  }
