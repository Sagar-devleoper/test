const agentStatusController = require("../controllers/agentStatusController")
const { isAuthenticated } = require('../middleware/Auth')
const express = require("express")
const router = express.Router()

router.post("/add/status" , isAuthenticated,agentStatusController.addAgentStatus)

router.get("/get/status/:id" , agentStatusController.getAgentStatus)

router.get("/get/agentnearbussines" , isAuthenticated , agentStatusController.getAgentNearBussinessOwner)

router.put("/update/agent" , isAuthenticated, agentStatusController.updateAgentStatus)

module.exports = router