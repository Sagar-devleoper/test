const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const user = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String
    },
    devices: {
        type: Array
    },
    role: {
        type: String,
        enum: {
            values: ["consumer", "bussinessOwner", "agent", "admin", "subAdmin"]
        }
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    dateOfBirth : {
        type : String
    },
    CouponCodes : {
        code_id: {
            type : String,
        }, 
        Status: {
            type : Boolean
        }
    }
}, { timestamps: true })


user.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}


user.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id },config.JWT, {
        expiresIn: '7d'
    })
}

user.methods.reset = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetpassword = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetpasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken;
}

module.exports = mongoose.model("user", user)