const express = require('express');
const router = express.Router();

const SuperAdminController = require('../controllers/superAdminController');

router.post('/register',SuperAdminController.register);
router.get('/getAllHospitals',SuperAdminController.getAllHospitals);
router.post('/updateHospitalApproval', SuperAdminController.updateHospitalApproval);
router.get('/getHospital/:id', SuperAdminController.getHospitalById);


module.exports = router;