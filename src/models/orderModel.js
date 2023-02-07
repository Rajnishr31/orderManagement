const mongoose = require("mongoose")
const objectId= mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    customerId:{
        type:objectId,
        required:true
    },
    itemName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },

    cashback:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("order", orderSchema)