import jwt from "jsonwebtoken";

export const verifyToken =  (req,res,next) =>{
    
    // const token = req.cookies.token;
    // if(!token) return res.status(401).json({message:"Not authenticated"});
    // try {
    //     const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //     req.userId = decoded.id;
    //     next();  
    // } catch (err) {
    //     console.error("Token verification failed:", err);
    //     return res.status(401).json({message:"Invalid token"});
    // }

    const authHeader = req.get("Authorization");
    if(!authHeader || !authHeader.startsWith(("Bearer "))){
        return res.status(401).json({ message: "Not Authenticated"});
    }

    const token = authHeader.split(" ")[1];
    try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.userId = decoded.id;
     next();
    } catch  {
        return res.status(401).json({message: "Invalid Token "});
    }
};