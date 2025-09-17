import jwt from "jsonwebtoken"
import doctorModel from "../models/doctorModel.js"

// Doctor authentication middleware using dToken
const authDoctor = async (req, res, next) => {
    try {
        // Get token from headers - specifically looking for dToken
        const dToken = req.headers.dtoken || req.headers.authorization;
        
        if (!dToken) {
            return res.status(401).json({ success: false, message: "Doctor access token required" });
        }

        // Remove 'Bearer ' prefix if present
        const actualToken = dToken.startsWith('Bearer ') ? dToken.slice(7) : dToken;

        // Verify the token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // Check if token has required data
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid doctor token format" });
        }

        // Verify the user is actually a doctor
        const doctor = await doctorModel.findById(decoded.id).select('-password');
        if (!doctor) {
            return res.status(401).json({ success: false, message: "Doctor not found" });
        }

        // Check if doctor is active/approved
        if (!doctor.available) {
            return res.status(403).json({ success: false, message: "Doctor account is not active" });
        }

        // Attach doctor info to request object
        req.user = { 
            docId: decoded.id,
            doctorData: doctor
        };
        
        next();

    } catch (error) {
        console.log('Auth Doctor middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Doctor token expired. Please login again.",
                code: "TOKEN_EXPIRED"
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid doctor token. Please login again.",
                code: "INVALID_TOKEN"
            });
        }
        
        res.status(500).json({ success: false, message: "Doctor authentication failed" });
    }
}

export default authDoctor;