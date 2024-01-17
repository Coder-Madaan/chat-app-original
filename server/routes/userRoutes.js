const { setAvatar, getAllUsers,register,login} = require("../controllers/userController");
// const { register } = require("../controllers/userController");
// const {login}=require("../controllers/userController")
// const {getAllUsers}=require("../controllers/userController")

//We send controls(controllers) along with routes  

const router=require("express").Router()
router.post('/register',register)
router.post('/login',login)
router.post('/setAvatar/:id',setAvatar)
router.get('/allusers/:id',getAllUsers)
module.exports=router;