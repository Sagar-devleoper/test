const express = require('express')
const router = express.Router()
const { ValidateUser } = require('../middleware/userValidations')
const userController = require('../controllers/userController')
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth')

router.post('/register/user', ValidateUser, userController.registeruser)

router.post('/verify/auth/user', userController.loginUser)

router.get('/get/user', isAuthenticated,authorizeRoles('admin'), userController.getUsers)

router.get('/get/user/:id', isAuthenticated, userController.getUserById)

router.put('/verify/auth/resetPassword', userController.resetPassword)

router.put('/update/user', isAuthenticated, userController.updateuserData)
// router.get('/me', isAuthenticated, userController.profile)

router.get('/me/agent', isAuthenticated, userController.agentProfile)


// internal services
// router.get('/get/:id', userController.internalservices)


module.exports = router