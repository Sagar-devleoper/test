const mongoose = require("mongoose")
const generator = require('generate-password');
// {User , Start_Date , End_Date , Status , Code}
const Coupon = mongoose.Schema({
    offer_Tittle:{
        type:String
    },
    description:{
        type:String
    },
    Minimun_order:{
        type:Number
    },
    Start_Date : {
        type : String,
        required : true
    },
    End_Date : {
        type : String,
        required : true
    },
    User_id : [
        {
            User : {
                type : mongoose.Schema.ObjectId,
                ref : "user"
            } ,
            Status : {
                type : Boolean,
                default : false
            },
        }
    ],
    Code : {
        type : String,
        default : generator.generate({
            length: 10,
            numbers: true
        })
    },
    bussiness_id : {
        type : mongoose.Schema.ObjectId,
        ref : "BusinessOwner"
    },
    percentageOff : {
        type : Number,
        default : 0
    },
    activeStatus:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('Coupon', Coupon)