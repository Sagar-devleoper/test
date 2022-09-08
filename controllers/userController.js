// get user and delete is not done

const user = require('../models/user')
const admin = require("../models/admin")
const agent = require("../models/agent")
const bussinessOwner = require("../models/businessOwner")
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const bcrypt = require('bcrypt')
const consumer = require('../models/consumer');
const config = require('../config/config')
const accountSid = config.TWILIO_ACCOUNT_SID
const authToken = config.TWILIO_AUTH_TOKEN;
const phoneNumber = config.TWILIO_PHONE_NUMBER
const serviceId = config.Service_SID;

exports.registeruser = catchAsyncErrors(async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            isBlocked,
            isActive,
            isOnline,
            isRemoved,
            profileImage,
            devices,
            userType,
            dateOfBirth,
        } = req.body;

        // const finduser = await user.findOne({ email: email });
        // const finduserphone = await user.findOne({ phone: phone })
        // // console.log(finduserphone , "finduserphone");

        // if (finduser || finduserphone) {
        //     res.status(400).json({
        //         success: false,
        //         message: 'user already exsit with same credtinals',
        //     })
        //     return
        // }

        const createuser = await user.create({
            name,
            email,
            phone,
            password,
            isBlocked,
            isRemoved,
            isOnline,
            isActive,
            profileImage,
            devices,
            userType,
            isactive: false,
            dateOfBirth,
        });
        if (!createuser) {
            res.status(400).json({
                success: false,
                message: 'cannot create user',
            })
        }

        if (createuser) {
            const token = createuser.getJwtToken()
            // console.log(token)
            const salt = await bcrypt.genSalt(10);
            createuser.password = await bcrypt.hash(createuser.password, salt);

            // await data.save();
            createuser.token = token
            await createuser.save()
            res.status(200).json({
                success: true,
                message: "user register succesfully",
                data: createuser
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
});

// new login sagar sir
exports.loginUser = catchAsyncErrors(async (req, res) => {
    try {
        const { email, password, role, phone } = req.body
        // 
        console.log({ email, password, role })

        const finduser = await user.find({
            $or: [{
                email: email
            },
            {
                phone: phone
            }
            ]
        })
        console.log(finduser, "finduser")
        if (!role) {
            res.status(400).json({
                success: false,
                message: "Please Provide Email , Password , Role",
            })
            return
        }
        if (!finduser) {
            res.status(400).json({
                success: false,
                message: "Login  failled in try",
            });
            return
        }
        console.log(finduser)
        // console.log(finduser[0].isActive,'data')
        // if user is insactive then dont login
        if (finduser[0].isActive === false) {
            res.status(400).json({
                success: false,
                message: "User Is Inactive So You Cannot Login"
            })
            return
        }

        let passwordData
        let data1
        finduser && finduser.map((i) => {
            passwordData = i.password
            data1 = i
            console.log(i.password)
        })
        console.log(data1, "data1")
        const token = data1.getJwtToken()
        console.log(token, "token")

        if (finduser) {
            let ismatch = await bcrypt.compare(password, passwordData)
            // let ismatch = finduser.comparePassword(password)
            console.log(ismatch)
            if (!ismatch) {
                res.status(400).json({
                    success: false,
                    message: "Login unsuccesfully ",
                });
            }

            if (ismatch) {
                // const token = jwt.sign({
                //     id: finduser._id,
                //     isAdmin: finduser.isAdmin
                // },
                //     "ADGSGWUEVVKBSSGKJSKJJKGS",
                //     { expiresIn: '1w' }
                // )
                let userRoleData;
                console.log("Role", token)
                if (role === "agent") {
                    userRoleData = await agent.findOne({ agent_id: data1._id })
                } else if (role === "consumer") {
                    userRoleData = await consumer.findOne({ name: data1._id })
                } else if (role === "businessOwner") {
                    userRoleData = await bussinessOwner.findOne({ name: data1._id })

                    console.log(userRoleData , "login data")

                    if(!userRoleData.bussinessLogoStatus || !userRoleData.bussinessImagesStatus || !userRoleData.bannerImageStatus || !userRoleData.owneridproofurlStatus || !userRoleData.ownerImageStatus){
                        res.status(400).json({
                            success: false,
                            message: "Login Unsuccesfully ",
                        });
                        return 
                    }
                } else if (role === "admin") {
                    userRoleData = await admin.findOne({ name: data1._id })
                } else if (role === "subAdmin") {
                    userRoleData = await admin.findOne({ name: data1._id })
                }
                let data = []
                // data.push(data1,token)
                // console.log(";hjjj", data1)
                data1.token = token
                console.log(data1, "data1")
                const token1 = Object.assign(data1, { token })
                console.log(token1, 'lll')
                if (token1) {
                    res.status(200).json({
                        success: true,
                        message: "Login succesfully ",
                        data: token1,
                        // userRole: userRoleData,
                        // token: token
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Login Unsuccesfully ",
                    });
                }
            }

        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Login  failled in catch",
        });
    }
})


exports.getUsers = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await user.find()

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsers failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsers Succesfully",
                count:findusers.length,
                data: findusers
            });
        }

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "getUsers failled in catch",
        });
    }
})

exports.getUserById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await user.findById(req.params.id)

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsersById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsersById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getUsersById failled in catch",
        });
    }
})

exports.resetPassword = async (req, res) => {
    try {
        const { phone, email, password, cpassword } = req.body;

        // if(!phone || !email){
        //     res.status(400).json({
        //         success: false,
        //         message: "Please Enter The Data",
        //     });
        //     return
        // }

        let bcryptpassword

        if (password !== cpassword) {
            res.status(400).json({
                success: false,
                message: "Password And Cpassword Is Not Matching",
            });
            return
        } else {
            const salt = await bcrypt.genSalt(10)
            bcryptpassword = await bcrypt.hash(password, salt)

            const finduser = await user.find({
                $or: [{
                    email: email
                },
                {
                    phone: phone
                }
                ]
            })

            if (finduser) {
                console.log(finduser, "finduser")
                const updateuser = await user.findByIdAndUpdate(finduser[0]._id, {
                    password: bcryptpassword
                }, { new: true })

                if (!updateuser) {

                    res.status(400).json({
                        success: false,
                        message: "Update User Failled For Password",
                    });
                    return
                }

                if (updateuser) {

                    // console.log(finduser , "number user")
                    res.status(200).json({
                        success: true,
                        message: "New Password Is Updated",
                        data: updateuser
                    });
                    return
                }

            }
            // const findUser = await user.find({phone : phone})
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "resetPassword failled in catch",
        });
    }
}

// consumer 
exports.profile = catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.user, "profile me id")
        const users = await user.findById(req.user._id)
        console.log(users._id)
        const findConsumer = await consumer.find({ name: users._id }).populate('name')
        // console.log(findConsumer)
        res.status(200).json({
            success: true,
            message: "user fetch sucessfully",
            data: findConsumer,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "token invalid ! something went wrong"
        })
    }
})

exports.updateuserData = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body
        const updateUserData = await user.findByIdAndUpdate(req.user._id, data, {
            new: true
        })
        if (!updateUserData) {
            return res.status(400).json({
                message: "user data cannot find",
                success: false
            })
        }
        if (updateUserData) {
            return res.status(200).json({
                messagae: "data found",
                success: true,
                data: updateUserData
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            messagae: "internal server error",
            success: false
        })
    }
})

// profile for agent

exports.agentProfile = async (req, res) => {
    try {
        const users = await user.findById(req.user._id)
        console.log(users._id)
        const findConsumer = await agent.find({ agent_id: users._id }).populate('agent_id')
        // console.log(findConsumer)
        res.status(200).json({
            success: true,
            message: "user fetch sucessfully",
            data: findConsumer,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            messagae: "internal server error",
            success: false
        })
    }
}