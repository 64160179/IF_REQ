import User from "../models/UserModel.js";

// ตรวจสอบว่ามีการล็อกอินเข้าสู่ระบบหรือไม่ จาก session
export const verifyUser = async (req, res, next) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account !"});
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found !"});
    req.userId = user.id;
    req.role = user.role; 
    next();
}

// ตรวจสอบว่าเป็น admin หรือไม่
export const adminOnly = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found !"});
    if(user.role !== "admin") return res.status(403).json({msg: "You don't have permission to access this route !"});
    next();
}