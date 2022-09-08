// update and delete is not done


const consumer = require('../models/consumer')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.addCosumer = catchAsyncErrors(async (req, res) => {
    try {
        console.log(req)
        let { name, gender, Dob, isAnonymous, currentAddress, addresList, orders, feedbacks, orderable_favourites } = req.body
        const checkData = await consumer.findOne({ name: req.body.name })
        if (checkData) {
            res.status(400).json({
                success: false,
                message: "cosumer already exist",
            })
            return
        }

        const createCosumer = await consumer.create({
            name, gender, Dob, isAnonymous, currentAddress, addresList, orders, feedbacks, orderable_favourites
        })
        if (!createCosumer) {
            res.status(400).json({
                success: false,
                message: "cannot create the user",
            });
            return
        }
        
        if (createCosumer) {
            await createCosumer.save()
            res.status(200).json({
                success: true,
                message: "cosumer created sucessfulyy",
                data: createCosumer
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


exports.getConsumer = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await consumer.find().populate('name')

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getConsumer failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getConsumer Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getConsumer failled in catch",
        });
    }
})

exports.getConsumerById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await consumer.findById(req.params.id)

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getConsumerById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getConsumerById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getConsumerById failled in catch",
        });
    }
})


exports.getConsumerByUserId = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await consumer.find({ name : req.params.id})

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getConsumerById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getConsumerById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getConsumerById failled in catch",
        });
    }
})


exports.UpdateConsumer = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findConsumer = await consumer.findById(req.params.id)
        

        if (!findConsumer) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findConsumer) {

            const updateConsumer = await consumer.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateConsumer) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateConsumer) {
                res.status(200).json({ 
                    success : true, 
                    message : "Consumer Is Updated" ,
                    data : updateConsumer
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Consumer Is Not Possible" 
        })
    }
}