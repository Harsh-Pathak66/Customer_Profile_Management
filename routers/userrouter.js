const router=require('express').Router()
const regc=require('../controllers/regcontroller')
const multer=require('multer')

let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/profileimages')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const upload=multer({
    storage:storage,
    limts:{filesize:1024*1024*4}
})
function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}
function handlerole(req,res,next){
    if(req.session.role=='pvt'){
        next()
    }else{
        res.send('you dont have to right to see the contact details. pls subscibe')
    }
}

router.get('/',regc.loginpage)
router.post('/',regc.logincheck)
router.get('/signup',regc.signuppage)
router.post('/signup',regc.usercreation)
router.get('/logout',regc.logout)
router.get('/fogot',regc.forgotpasswordform)
router.post('/fogot',regc.forgotpasswordlink)
router.get('/forgotlink/:email',regc.forgotlink)
router.post('/forgotlink/:email',regc.fogotpasswordupdate)
router.get('/userprofile',handlelogin,regc.usersprofile)
router.get('/profile',regc.profileform)
router.post('/profile',upload.single('img'), regc.profileupdate)
router.get('/contactdetails/:id',handlelogin,handlerole,regc.contactdetails)
router.get('/passwordchange',regc.passwordchangeform)
router.post('/passwordchange',regc.passwordchange)

module.exports=router