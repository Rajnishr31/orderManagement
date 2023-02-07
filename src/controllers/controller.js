const customerModel = require('../models/customerModel')
const orderModel = require('../models/orderModel')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId


const isValid = function (value) {
    if (!value || value == null) return false
    if (value == Number) return false
    if (value == String && value.trim() == "") return false

    return true
}


const createCustomer = async function (req, res) {
    try{
        const data = req.body
        let fields = Object.keys(data);
        if (fields.length == 0) return res.status(400).send({ status: false, message: "Please provide data for create the customer." });
    
    
        if (!isValid(data.name)) return res.status(400).send({ status: false, message: "name is mandatory" });
        if (!(data.name).match(/^[a-zA-Z_ ]+$/)) return res.status(400).send({ status: false, message: "give valid name" });
    
        //check validation for email ---------------------------------------------------------------
        if (!isValid(data.email)) return res.status(400).send({ status: false, message: "email is mandatory" });
        if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" })
    
        // phone validation ---------------------------------------------
        if (!isValid(data.phone)) return res.status(400).send({ status: false, message: "phone is mandatory" });
        if (!(data.phone.match(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/))) return res.status(400).send({ status: false, message: "phone number is not valid" })
        if (data.phone.length == 10) data.phone = '91' + data.phone
    
        /*----------------------------------- Checking Unique -----------------------------*/
    
        const email = await customerModel.findOne({ email: data.email });
        if (email) return res.status(400).send({ status: false, message: "email already exist" })
    
        const phone = await customerModel.findOne({ phone: data.phone });
        if (phone) return res.status(400).send({ status: false, message: "phone already exist" })
    
    
        // password validation --------------------------------
        if (!isValid(data.password)) return res.status(400).send({ status: false, message: "password is mandatory" });
        if (data.password.length < 8 || data.password.length > 15) return res.status(400).send({ status: false, message: "password length should be in range 8-15" });
        if (!(data.password.match(/.*[a-zA-Z]/))) return res.status(400).send({ status: false, error: "Password should contain alphabets" }) // password must be alphabetic //
        if (!(data.password.match(/.*\d/))) return res.status(400).send({ status: false, error: "Password should contain digits" })// we can use number also //
    
        
        if (!isValid(data.address.street)) return res.status(400).send({ status: false, message: "address street is mandatory" });
        if (!isValid(data.address.city)) return res.status(400).send({ status: false, message: "address city is mandatory" });
        if (!data.address.pincode) return res.status(400).send({ status: false, message: "address pincode is mandatory" });
        if (parseInt(data.address.pincode) != data.address.pincode) return res.status(400).send({ status: false, message: "shipping address pincode should only be Number" });

        const savedData= await customerModel.create(data)
        res.status(201).send({status:true, message:"Success",data:savedData})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}


const createOrder = async function (req, res) {
    try{
        const customerId=req.params.customerId
        const data = req.body
        let createOrder={}
        if(!ObjectId.isValid(customerId)) return res.status(400).send({status:false,message:"customerId invalid"})
        const customerData = await customerModel.findById(customerId)
        if(!customerData) return res.status(400).send({status:false,message:"customer not exist with that you want to createe order"})
        createOrder.customerId=customerId
        createOrder.itemName=data.itemName
        createOrder.amount=data.amount

        if(customerData.orders.length==9){
            await customerModel.findByIdAndUpdate(customerId,{customer:'gold'},{new:true})
        }
        if(customerData.orders.length==19){
            await customerModel.findByIdAndUpdate(customerId,{customer:'platinum'},{new:true})
        }

        
        
      
        if(customerData.customer=='regular') discount =0
        if(customerData.customer=='gold') discount =10
        if(customerData.customer=='platinum') discount=20
  

        let cashback = (data.amount*discount)/100
        createOrder.cashback= cashback

        const savedData= await orderModel.create(createOrder)

        let orderArr =customerData.orders
        orderArr.push(savedData._id)
        await customerModel.findByIdAndUpdate(customerId,{$set:{orders:orderArr}})
        return res.status(201).send({status:true,message:"Success",data:savedData})



    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

}


module.exports.createCustomer = createCustomer
module.exports.createOrder = createOrder