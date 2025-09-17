import jwt from "jsonwebtoken"

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Access token required" })
        }

        // Verify the token
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
        
        // Check if the decoded token has the expected structure
        if (!decoded.email || !decoded.role || decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Invalid token structure" })
        }

        // Check if the email matches admin email (optional additional security)
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not authorized" })
        }

        // Attach user info to request
        req.user = decoded
        next()

    } catch (error) {
        console.log('Auth middleware error:', error)
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please login again." })
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token. Please login again." })
        }
        
        res.status(500).json({ success: false, message: "Authentication failed" })
    }
}

export default authAdmin