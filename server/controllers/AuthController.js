import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบบัญชีผู้ใช้นี้ในระบบ"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "รหัสผ่านไม่ถูกต้อง"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const fname = user.fname;
    const lname = user.lname;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, fname, lname, email, role});
}

export const Me = async (req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account !"});
    }
    const user = await User.findOne({
        attributes:['uuid', 'fname', 'lname', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found !"});
    res.status(200).json(user);
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Cannot log out !"});
        res.status(200).json({msg: "You have logged out !"});
    });
}