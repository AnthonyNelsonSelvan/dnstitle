import rateLimit from ("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,   // Add `RateLimit-*` headers
  legacyHeaders: false     // Disable `X-RateLimit-*` headers
});

const loginLimiter = rateLimit({
  windowMs:15*60*1000, 
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  
  legacyHeaders: false 
});

const dnsLimiter = rateLimit({
  windowMs:15*60*1000, 
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  
  legacyHeaders: false
})

const passLimiter = rateLimit({
  windowMs:15*60*1000, 
  max: 2,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  
  legacyHeaders: false
})

const securityLimiter = rateLimit({
  windowMs:15*60*1000, 
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  
  legacyHeaders: false
})

export {globalLimiter,loginLimiter,dnsLimiter,passLimiter,securityLimiter}