import jwt from "jsonwebtoken"

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.token || req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Access token required" });
        }

        // Remove 'Bearer ' prefix if present
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

        // Verify the token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // Check if token has required data
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        // Attach user info to request object (use req.user, not req.body)
        req.user = { userId: decoded.id };
        next();

    } catch (error) {
        console.log('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please login again." });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
        }
        
        res.status(500).json({ success: false, message: "Authentication failed" });
    }
}

export default authUser;