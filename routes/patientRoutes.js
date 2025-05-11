const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientControllers');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register',patientController.register);
router.post('/login',patientController.login);
router.post('/otp',patientController.sendOTP)
router.get('/verify-token',verifyToken,patientController.checkToken)
router.post('/logout',verifyToken,patientController.logout)
router.post('/send-confirmation-mail', patientController.sendConfirmationMail); 
router.get('/get-user-details',patientController.getUserDetails)
router.get('/get-appointments',patientController.getAppointments);
router.delete('/cancel-appointment/:id',patientController.cancelAppointment)
router.get('/getUserDetailsWhileLogin',patientController.getUserDetailsWhileLogin)
router.post('/updateUserDetails',patientController.updateUserDetails);
router.post('/updateUserImage',patientController.updateUserImage)

module.exports = router;