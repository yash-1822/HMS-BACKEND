const express = require('express');
const router = express.Router();
const hospitalAdminController = require("../controllers/hospitalAdminControllerjs")


router.post("/addUser",hospitalAdminController.addUser)
router.get("/getAppointmentStats",hospitalAdminController.getAppointmentStats);
router.get('/getDoctors',hospitalAdminController.getDoctors)
router.get('/fetchAppointments',hospitalAdminController.fetchAppointments)


module.exports = router;
