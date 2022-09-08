
const agent = require('../models/agent')
const user = require("../models/user")
const order = require("../models/order")
const product = require("../models/Product")
const businessOwner = require("../models/businessOwner")
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const axios = require("axios")
const AWS = require("aws-sdk")
const fs = require("fs")
const config = require('../config/config')

const multer = require("multer")

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME
const q = require('q')


AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addagent = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body

        const userdata = await user.findById(data.agent_id)


        const checkData = await agent.findOne({ agent_id: req.body.agent_id })
        if (checkData) {
            res.status(201).json({
                success: true,
                message: "agent already exist",
            })
            return
        }

        // add vehicle lincense image 

        let fileObject = [
            {
                key: req.files.vehicleLicenceImage[0].originalname,
                value: req.files.vehicleLicenceImage[0].buffer,
                filekey: 'vehicleLicenceImage'
            }
        ]

        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            // console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        // console.log(newupdateobject, '77')

        let vehicleLicenceImage

        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'vehicleLicenceImage') {
                // console.log(m.Location)
                vehicleLicenceImage = m.Location
                return m.Location
            }
        })

        const createagent = await agent.create({
            agent_id: req.body.agent_id,
            income: req.body.income,
            address: req.body.address,
            feedbacks: req.body.feedbacks,
            last_active: req.body.last_active,
            active_status: req.body.active_status,
            dob: req.body.dob,
            vehicle_type: req.body.vehicle_type,
            vehicle_reg: req.body.vehicle_reg,
            orders: req.body.orders,
            bankName: req.body.bankName,
            bankAccountNumber: req.body.bankAccountNumber,
            bankAccountHolderName: req.body.bankAccountHolderName,
            bankCode: req.body.bankCode,
            location:{
                type:"Point",
                coordinates:[parseFloat(req.body.lat),parseFloat(req.body.log)]
            },
            // images
            vehicleLicenceImage: vehicleLicenceImage,
            lat: req.body.lat,
            log: req.body.log,
            service_radius: req.body.service_radius,
            verification: req.body.verification,
        })
        
        if (!createagent) {
            res.status(400).json({
                success: false,
                message: 'cannot create agent',
            })
            return
        }
        if (createagent) {
            await createagent.save()
            res.status(200).json({
                success: true,
                message: "agent register succesfully",
                data: createagent,
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

exports.getAgent = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await agent.find()

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAgent failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAgent Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getAgent failled in catch",
        });
    }
})

exports.getAgentById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await agent.find({agentUrl:req.params.id})
        // console.log(findusers)
        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAgentById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAgentById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getAgentById failled in catch",
        });
    }
})

async function uploadMultipleFiles(fileObject) {
    console.log(fileObject, "fileobject")
    const deferred = q.defer();
    let s3response = []
    try {

        for (const file of fileObject) {
            const params = {
                Bucket: BUCKET_NAME,
                Key: file.key, // File name you want to save as in S3
                Body: file.value,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            const data = await s3.upload(params).promise()
            console.log(data, '255')
            s3response.push({

                key: file.filekey,
                fileName: data.key,
                Location: data.Location
            })
        }

    } catch (err) {
        console.log(err)
    }
    deferred.resolve(s3response)
    console.log(deferred, "deferred")
    return deferred.promise

}


exports.assignordertoagent = async (req, res) => {
    try{
        const findorder = await order.find();
        let allowner= []

        // console.log(findorder.product)
        for(let i = 0; i < findorder.length; i++){
            // console.log(findorder[i].sellerBussinessId)
            const findBussinessOwner = await businessOwner.findById(findorder[i].sellerBussinessId)
            allowner.push(findBussinessOwner)
        }
        // const findagent = await agent.find();

        res.status(200).json({
            success: true,
            message: " get thing",
            order : findorder,
            bussinessowner : allowner
            // bussinessowner : findBussinessOwner,
            // agent : findagent
        });

    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "cannot get order",
        });
    }
}

exports.UpdateAgent = async (req, res) => {
    try {
        const data = req.body;
        console.log(data , "data")

        const findAgent = await agent.findById(req.params.id)

        if (!findAgent) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findAgent) {

            const updateAgent = await agent.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateAgent) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateAgent) {
                res.status(200).json({ 
                    success : true, 
                    message : "Agent Is Updated" ,
                    data : updateAgent
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Agent Is Not Possible" 
        })
    }
}