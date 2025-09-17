import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express()
const port = process.env.PORT || 4000

// Connect to services
connectDB()
connectCloudinary();

// CORS middleware - COMPLETE solution for all token headers
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174", 
        "https://cms-frontend-zeta-plum.vercel.app",
        "https://cms-admin-one-sigma.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'token',       // For frontend
        'atoken',      // For admin dashboard  
        'dtoken',      // For doctor dashboard - ADDED
        'x-token',
        'x-auth-token',
        'access-token'
    ]
}));

// Handle preflight requests explicitly for ALL routes
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header('Access-Control-Allow-Headers', 
        'Content-Type, Authorization, X-Requested-With, Accept, token, atoken, dtoken, x-token, x-auth-token, access-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(200);
});

// Other middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware to see incoming requests (optional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    next();
});

// API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CMS Backend is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: "CMS Backend API WORKING",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            admin: "/api/admin",
            doctor: "/api/doctor", 
            user: "/api/user",
            payment: "/api/payment"
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    res.status(err.status || 500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong. Please try again later.' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 404 handler - must be last
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        available_endpoints: [
            '/health',
            '/api/admin/*',
            '/api/doctor/*',
            '/api/user/*', 
            '/api/payment/*'
        ]
    });
});

app.listen(port, () => {
    console.log(`🚀 Server Started on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ CORS enabled for:`);
    console.log(`   - http://localhost:5173`);
    console.log(`   - http://localhost:5174`);
    console.log(`   - https://cms-frontend-zeta-plum.vercel.app`);
    console.log(`   - https://cms-admin-one-sigma.vercel.app`);
    console.log(`✅ Allowed headers: token, atoken, dtoken, and standard auth headers`);
});