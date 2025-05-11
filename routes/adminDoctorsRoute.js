const express = require('express');
const router = express.Router();

const adminDoctorController = require('../controllers/adminDoctorController');

router.post('/login',adminDoctorController.login);
router.get('/verifyUser',adminDoctorController.verifyUser)
router.post('/update-day-availability',adminDoctorController.updateDayAvailability)
router.post('/getAppointments',adminDoctorController.getAppointments)
router.post('/getAppointmentsAll',adminDoctorController.getAppointmentsAll)
router.post('/cancel-appointment',adminDoctorController.cancelAppointment)
router.post('/complete-appointment',adminDoctorController.completeAppointment)
router.get('/appointment-stats', adminDoctorController.getAppointmentStats);
router.post('/add-doctor',adminDoctorController.addDoctor)

module.exports = router;