import jwt from "jsonwebtoken";

export const verifyToken =  (req,res,next) =>{
    console.log("verifyToken called for:", req.method, req.url);
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:"Not authenticated"});
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();  
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({message:"Invalid token"});
    }

}