const Reg = require('../models/reg')
const bcrypt = require('bcrypt')
const nodemailer=require('nodemailer')
const { findByIdAndUpdate } = require('../models/reg')

exports.loginpage = (req, res) => {
    try {
        res.render('login.ejs', { message: '' })
    } catch (error) {
        console.log(error)
    }
}

exports.signuppage = (req, res) => {
    try {
        res.render('signupform.ejs', { message: '' })
    } catch (error) {
        console.log(error)
    }

}

exports.usercreation = async (req, res) => {
    const { email, pass } = req.body
    try {
        const emailcheck = await Reg.findOne({ email: email })
        // console.log(emailcheck)
        if (emailcheck == null) {
            const convertpass = await bcrypt.hash(pass, 10)
            const record = new Reg({ email: email, password: convertpass })
            record.save()
            // console.log(record)
            res.render('signupform.ejs', { message: 'Account has been created successfully' })
        } else {
            res.render('signupform.ejs', { message: 'Email is already registered with us' })
        }
    } catch (error) {
        console.log(error)
    }

}

exports.logincheck = async (req, res) => {
    const { email, pass } = req.body
    try {
        const emailcheck = await Reg.findOne({ email: email })
        if (emailcheck !== null) {
            const passwordcompared = await bcrypt.compare(pass, emailcheck.password)
            // console.log(passwordcompared)
            if (passwordcompared) {
                req.session.isAuth = true
                req.session.loginemail = email
                req.session.role=emailcheck.role
                if (emailcheck.email == 'admin@gmail.com') {
                    res.redirect('/admin/dashboard')
                } else {
                    res.redirect('/userprofile')
                }

            } else {
                res.render('login.ejs', { message: 'Wrong Credential' })
            }

        } else {
            res.render('login.ejs', { message: 'Wrong Credential' })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

exports.dashboard = (req, res) => {
    const loginemail = req.session.loginemail
    res.render('admin/dashboard.ejs', { loginemail })
}

exports.userdetail = async (req, res) => {
    const loginemail = req.session.loginemail
    const record = await Reg.find()
    res.render('admin/users.ejs', { loginemail, record })
}
exports.forgotpasswordform = (req, res) => {
    res.render('forgotpasswordform.ejs', { message: '' })
}
exports.forgotpasswordlink = async (req, res) => {
    const { email } = req.body
    const emailcheck = await Reg.findOne({ email: email })
    if (emailcheck == null) {
        res.render('forgotpasswordform.ejs', { message: 'Email not found' })
    } else {
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'datashareme143@gmail.com', // generated ethereal user
                pass: 'ofmykyagthyzdieh', // generated ethereal password
            },
        });
        console.log("Connect to smtp gmail")
        let info = await transporter.sendMail({
            from: 'datashareme143@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Forgot Password Link', // Subject line
            text: 'hello', // plain text body
            html: `<a href=http://localhost:5000/forgotlink/${email}>Click To Change Password</a>`, // html body
           
          });
          console.log("Email sent")
          res.render('forgotpasswordform.ejs',{message: 'Link has been sent to your Registerd Email' })
        }
    }
exports.forgotlink=(req,res)=>{
    const email=req.params.email
    res.render('forgotlink.ejs',{email})
}
exports.fogotpasswordupdate=async(req,res)=>{
    const{password}=req.body
    const convertedpass=await bcrypt.hash(password,10)
    const email=req.params.email
    const record=await Reg.findOne({email:email})
    const id=record.id
    await Reg.findByIdAndUpdate(id,{password:convertedpass})
    res.render('forgotmessage.ejs')
}

exports.usersprofile=async(req,res)=>{
    const loginemail=req.session.loginemail
    const record=await Reg.find({img:{$nin:['user.png']}})
    res.render('userprofile.ejs',{loginemail,record})
}

exports.profileform=async(req,res)=>{
    
    const loginemail=req.session.loginemail
    const record=await Reg.findOne({email:loginemail})
    res.render('profileform.ejs',{loginemail,record,message:''})
}
exports.profileupdate=async(req,res)=>{
    const{fname,lname,mobile,desc}=req.body
    const loginemail=req.session.loginemail
    const record=await Reg.findOne({email:loginemail})
    const id=record.id
    if(req.file){
        const filename=req.file.filename
        await Reg.findByIdAndUpdate(id,{firstName:fname,lastName:lname,mobile:mobile,img:filename,desc:desc})
    }else{
        await Reg.findByIdAndUpdate(id,{firstName:fname,lastName:lname,mobile:mobile,desc:desc})
    }
    
    // res.render('profileform.ejs',{loginemail,record,message:'Successfully Profile Has Been Updated'})
    res.redirect('/userprofile')

}

exports.contactdetails=async(req,res)=>{
    const loginemail=req.session.loginemail
    const id=req.params.id
    const record=await Reg.findByIdAndUpdate(id)
    res.render('contactdetails.ejs',{loginemail,record})
}

exports.roleupdate=async(req,res)=>{
    const id=req.params.id
    const record=await Reg.findById(id)
    let newRoll='pvt'
    if(record.role=='public'){
        newRole='pvt'
    }else{
        newRole='public'
    }
    await Reg.findByIdAndUpdate(id,{role:newRole})
    res.redirect('/admin/users')
}

exports.passwordchangeform=(req,res)=>{
    const loginemail=req.session.loginemail
    res.render('passwordchangeform.ejs',{loginemail,message:''})
}

exports.passwordchange=async(req,res)=>{
    const{email,cpass,npass}=req.body
    const record=await Reg.findOne({email:email})
    const id=record.id
    const passwordcompare= await bcrypt.compare(cpass,record.password)
    if(passwordcompare){
        const newpass=await bcrypt.hash(npass,10)
        await Reg.findByIdAndUpdate(id,{password:newpass})
        res.render('passwordchangeform.ejs',{loginemail,message:'Password successfuly updated'})
    }else{
        res.render('passwordchangeform.ejs',{loginemail,message:'Password Not Matched'})
    }
}
