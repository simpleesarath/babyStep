const corsOptions = { 
  origin: process.env.FRONTEND_URL || 'https://babystep-frontend.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
};
