const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorsController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/getDoctors/:id',doctorController.getDoctors);
router.get('/getDoctorsByHospitalId/:id',doctorController.getDoctorsByHospitalId);
router.get('/getDoctorsByCity/:id',doctorController.getDoctorsByCity)
// router.get("/getUniqueSpecialities",verifyToken,doctorController.getUniqueSpecialities);

router.post('/getDoctors/related',verifyToken,doctorController.getRelatedDoctors);
router.post('/bookAppointment',doctorController.addAppointment);
// In routes/doctorRoutes.js
router.get("/:doctorId/appointments", doctorController.getBookedSlots);
router.get('/:id',verifyToken,doctorController.getDoctorById);


module.exports = router;