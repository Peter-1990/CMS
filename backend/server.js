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
connectDB()
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://cms-frontend-zeta-plum.vercel.app",
        "https://cms-admin-one-sigma.vercel.app"
    ],
    credentials: true
}));

//api endpoints

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.listen(port, ()=> console.log("Server Started",port))