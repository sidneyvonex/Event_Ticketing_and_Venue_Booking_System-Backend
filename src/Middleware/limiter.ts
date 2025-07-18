import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';

const rateLimiter = new RateLimiterMemory({
    points: 20, // Number of requests
    duration: 60, // Per second
});
export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip || 'unknown');
       
        next();
    } catch (error) {
        res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
};