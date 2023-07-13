const mongoose=require('mongoose')
const regSchema=mongoose.Schema({
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    mobile:Number,
    img:{type:String,default:'user.png'},
    desc:String,
    role:{type:String,default:'public'}
})
module.exports=mongoose.model('reg',regSchema)