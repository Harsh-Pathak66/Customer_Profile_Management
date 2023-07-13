const router=require('express').Router()
const regc=require('../controllers/regcontroller')

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}

router.get('/dashboard',handlelogin,regc.dashboard)

router.get('/users',handlelogin,regc.userdetail)
router.get('/roleupdate/:id',regc.roleupdate)





module.exports=router