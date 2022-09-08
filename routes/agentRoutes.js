const express = require('express')
const router = express.Router()
const agentController = require('../controllers/agentController')
const { validateagent } = require('../middleware/userValidations')
const { isAuthenticated } = require('../middleware/Auth')
const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});

router.post('/add/agent', uploadService.fields([{
    name: 'vehicleLicenceImage'
}
]), isAuthenticated, agentController.addagent)


router.get('/get/agent', isAuthenticated, agentController.getAgent)

router.get('/get/agent/:id', isAuthenticated, agentController.getAgentById)

router.get('/assign/order', isAuthenticated, agentController.assignordertoagent)

router.put('/update/agent/:id', isAuthenticated, agentController.UpdateAgent)

module.exports = router