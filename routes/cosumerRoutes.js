const express = require('express')
const router = express.Router()
const cosumerController = require('../controllers/consumerController')
const { validateCosumer } = require('../middleware/userValidations')
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth')



router.post('/add/cosumer', isAuthenticated, validateCosumer, cosumerController.addCosumer)

router.get('/get/cosumer', isAuthenticated, authorizeRoles('admin'),cosumerController.getConsumer)

router.get('/get/cosumer/:id', isAuthenticated, cosumerController.getConsumerById)
router.get('/get/cosumeruser/:id', isAuthenticated, cosumerController.getConsumerByUserId)
router.put('/update/cosumer/:id', isAuthenticated, cosumerController.UpdateConsumer)

module.exports = router