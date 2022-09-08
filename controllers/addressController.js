const address = require("../models/address")

exports.addAddress = async (req, res) => {
    try {
        
        const { user , town , neighbouhood , area , placeName , otherDescription , saveAddressAs , lat , log } = req.body;

        if (!user || !town || !neighbouhood || !area || !placeName || !otherDescription || !saveAddressAs || !lat || !log) {
            res.status(400).json({ 
                success : false , 
                error : "Please Provide Info" 
            })
            return
        }

        const saveAddress = await address.create({ user , town , neighbouhood , area , placeName , otherDescription , saveAddressAs , lat , log })

        if (!saveAddress) {
            res.status(400).json({ 
                success : false , 
                error : "Address Is Not Created" 
            })
            return
        }

        if (saveAddress) {
            res.status(200).json({ 
                success : true , 
                message : "Address Is Added" ,
                data : saveAddress
            })
            return
        }

    } catch (error) {
        res.status(400).json({ 
            success : false , 
            error : "Address Is Not Added" 
        })
    }
}


exports.getAddress = async (req, res) => {
    try {
        // console.log(req.user._id , "re.user._id")
        const getAddress = await address.find({ user : req.user._id}).populate("user")

        if (!getAddress) {
            res.status(400).json({ 
                success : false , 
                error : "Address Is Not Get" 
            })
            return
        }

        if (getAddress) {
            res.status(200).json({ 
                success : true , 
                message : "Address Is Found" ,
                data : getAddress
            })
            return
        }

    } catch (error) {
        res.status(400).json({ 
            success : false , 
            error : "Address Is Not Found In Catch" 
        })
    }
}

exports.getAddressByUserId = async (req, res) => {
    try {
        // console.log(req.user._id , "re.user._id")
        // const { user_id } = req.body;
        const getAddress = await address.find({ user : req.params.id}).populate("user")

        if (!getAddress) {
            res.status(400).json({ 
                success : false , 
                error : "Address Is Not Get" 
            })
            return
        }

        if (getAddress) {
            res.status(200).json({ 
                success : true , 
                message : "Address Is Found" ,
                data : getAddress
            })
            return
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ 
            success : false , 
            error : "Address Is Not Found In Catch" 
        })
    }
}


exports.UpdateAddress = async (req, res) => {
    try {
        
        const { user , town , neighbouhood , area , placeName , otherDescription , saveAddressAs , lat , log } = req.body;

        const findAddress = await address.findById(req.params.id)

        if (!findAddress) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findAddress) {

            const updateAddress = await address.findByIdAndUpdate(req.params.id , {
                user , town , neighbouhood , area , placeName , otherDescription , saveAddressAs , lat , log
            } , {new : true})

            if (!updateAddress) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateAddress) {
                res.status(200).json({ 
                    success : true, 
                    message : "Address Is Updated" ,
                    data : updateAddress
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