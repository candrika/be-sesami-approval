import jwt from 'jsonwebtoken'

export const auth =(req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    
    if(!token) res.status(401).json({message:"Unauthorized"})

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        return next();
    }catch{
        return res.status(401).json({message:"Invalid token"})
    }
}

export const authorize = (roles: string[]) => {
   return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
       return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
};