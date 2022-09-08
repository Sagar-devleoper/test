const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const agent = require("../models/agent");
const agentStatus = require("../models/agentCurrentStatus")
const bussinessOwner = require("../models/businessOwner")
const order = require('../models/order')
const address = require('../models/address')

// this api for order assign to agent 
exports.addAgentStatus = async (req, res) => {
    try {
        const { agent_id, lat, log, bussiness_id, user_id, order_id, order_status } = req.body;
        // console.log(order_id,'data')
        const findrderData = await order.findById(order_id)
        console.log(findrderData.address, 'data')

        let adressData = findrderData.address
        const addstatus = await agentStatus.create({
            agent_id: req.body.agent_id,
            lat: req.body.lat,
            log: req.body.log,
            location: {
                type: "Point",
                coordinates: [parseFloat(req.body.log), parseFloat(req.body.lat)]
            },
            bussiness_id: findrderData.sellerBussinessId,
            user_id: findrderData.user,
            order_id,
            address:adressData,
            order_status
        })

        if (!addstatus) {
            res.status(400).json({
                success: false,
                message: "status is not added"
            })
            return
        }

        if (addstatus) {
            res.status(200).json({
                success: true,
                message: "status is added",
                data: addstatus
            })
            return
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "status is not added"
        })
    }
}


exports.getAgentStatus = catchAsyncErrors(async (req, res) => {
    try {
        const findStatus = await agentStatus.find({ agent_id: req.params.id }).populate('agent_id').populate('bussiness_id').populate('user_id').populate('order_id').populate('address')
        // console.log(findStatus, req.params.id)
        let add

        findStatus && findStatus.map((i) => {
            // console.log(i.order_id.address,'data')
            add = i.order_id.address
        })
        const findAdress = await address.findById(add)
        console.log(findAdress,'data')
        if (!findStatus) {
            res.status(400).json({
                success: false,
                message: "status not found",
            });
        }
        // const deliveryAddress = Object.assign(findStatus,{findAdress})
        if (findStatus) {
            res.status(200).json({
                success: true,
                message: "get data Succesfully",
                data: findStatus,
                // customer_Adress:findAdress
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "status is not added"
        })
    }
})

exports.getAgentNearBussinessOwner = async (req, res) => {
    try {
        console.log("hello")

        console.log(req.user, "req")



        const findBussiness = await bussinessOwner.findOne({ name: req.user.id });
        console.log(findBussiness)
        // console.log(findBussiness,findBussiness.log,'business')
        const coordinates = findBussiness.location.coordinates
        console.log(coordinates)


        // const findAgent = await agent.find()
        // $near : { type : "Point" , coordinates : [coordinates[1] , coordinates[0]] },
        const findAgent = await agent.aggregate([
            {
                $geoNear: {
                    near: coordinates,
                    key: "location",
                    maxDistance: parseFloat(5) * 1609,
                    distanceField: "dist.calculated",
                    spherical: true,
                    includeLocs: "coordinates"
                }
            }
        ])
        let agentId
        findAgent && findAgent.map((i) => {
            agentId = i._id
            console.log(i, "data")
        })
        const agentData = await agent.findById(agentId).populate('agent_id')
        // console.log(agentData,'agentData')

        // console.log(findAgent, "agent")
        if (!findAgent) {
            res.status(400).json({
                success: false,
                message: "Unable To Get Your Location"
            })
            return
        }

        if (findAgent) {
            res.status(200).json({
                success: true,
                message: "Your location find",
                data: findAgent,
                agentData: agentData
            })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Agent Is Not Find Near There is Error "
        })
    }
}


exports.updateAgentStatus = async (req, res) => {
    try {
        const { agent_id, lat, log, bussiness_id, user_id, order_id, location, order_status } = req.body;

        const findStatus = await agentStatus.find({ agent_id: req.user._id })

        console.log(findStatus)
        if (!findStatus) {
            res.status(400).json({
                success: false,
                message: "status is not get"
            })
            return
        }


        if (findStatus) {

            const updateStatus = await agentStatus.findByIdAndUpdate(findStatus[0]._id, {
                agent_id, lat, log, bussiness_id, user_id, order_id, location, order_status
            }, { new: true })

            console.log(updateStatus)
            if (!updateStatus) {
                res.status(400).json({
                    success: false,
                    message: "status is not get Update"
                })
                return
            }

            if (updateStatus) {
                res.status(200).json({
                    success: true,
                    message: "status is updated",
                    data: updateStatus
                })
                return
            }

        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "status is not added"
        })
    }
}

