const admin = require('../models/admin')
const user = require("../models/user")
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const axios  = require('axios');

exports.addAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const data = req.body

        const userdata = await user.findById(data.name)

        // console.log(userdata , "userdata")

        // console.log(userdata.userType , "userdata usertype")

        if(data.role !== userdata.userType){
            res.status(400).json({
                success: false,
                message: "cannot create the user This type not match while registration",
            });
            return
        }
        const createAdmin = await admin.create(data)
        if (!createAdmin) {
            // console.log(createAdmin)
            res.status(400).json({
                success: false,
                message: "cannot create the user",
            });
            return
        }
        if (createAdmin) {
            // console.log(createAdmin)
            await createAdmin.save()
            res.status(200).json({
                success: true,
                message: "user created sucessfulyy",
                data: createAdmin
            });
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error !",
            error
        });
    }
})

exports.getAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await admin.find().populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAdmin failled in try",
            });
        }

        if (findusers) {


            res.status(200).json({
                success: true,
                message: "getAdmin Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getAdmin failled in catch",
        });
    }
})

exports.getAdminById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await admin.findById(req.params.id).populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAdminById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAdminById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getAdminById failled in catch",
        });
    }
})


exports.UpdateAdmin = async (req, res) => {
    try {
        
        const data = req.body;

        const findAdmin = await admin.findById(req.params.id)

        if (!findAdmin) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findAdmin) {

            const updateAdmin = await admin.findByIdAndUpdate(req.params.id , { data } , {new : true})

            if (!updateAdmin) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateAdmin) {
                res.status(200).json({ 
                    success : true, 
                    message : "Admin Is Updated" ,
                    data : updateAdmin
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Address Is Not Possible" 
        })
    }
}