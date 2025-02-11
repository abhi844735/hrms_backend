const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async(req,res,next)=>{
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Access Denied" });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }

}