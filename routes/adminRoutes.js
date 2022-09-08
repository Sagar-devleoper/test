const express = require("express")
const router = express()
const adminController = require("../controllers/adminController")
const { validateadmin } = require("../middleware/userValidations")
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth')


router.post("/add/admin", isAuthenticated, authorizeRoles('admin'),validateadmin, adminController.addAdmin)

router.get("/get/admin", isAuthenticated, authorizeRoles('admin'),adminController.getAdmin)

router.get("/get/admin/:id", isAuthenticated,authorizeRoles('admin'), adminController.getAdminById)

router.put("/update/admin/:id", isAuthenticated, authorizeRoles('admin'),adminController.UpdateAdmin)

module.exports = router