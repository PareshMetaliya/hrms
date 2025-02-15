import Department from "../models/Department.js";
import User from "../models/User.js";

// Get All Department 
export const getAllDepartment = async(req,res)=>{

    const {role} = req.user.role;

    if (role !== "admin"){
        return res.status(400).json({success:false,message:"You are not allowed"})
    }

    // const departments = await Department.find().populate({path:"employees",model:Employee,})

}