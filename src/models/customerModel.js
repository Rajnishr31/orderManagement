const mongoose = require("mongoose")
const objectId= mongoose.Schema.Types.ObjectId

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requied: true
    },
    customer: {
        type: String,
        enum: ['regular', 'gold', 'platinum'],
        default: 'regular'
    },
    
    orders:{
        type:[objectId],
        ref:'order',
        default:[]
    },

    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            requied: true
        }
    }


}, { timestamps: true })


module.exports = mongoose.model("customer", customerSchema)

