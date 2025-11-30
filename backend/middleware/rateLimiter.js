import { rateLimit } from 'express-rate-limit';

export const predictLimiter = rateLimit({
        windowMs:1000,  // 1 second 
        max:5,
        message:{
            success: false,
            message:"Too many request slow down",
        },
        standardHeaders:true, // need rate limit info in headers
        legacyHeaders:false,
});