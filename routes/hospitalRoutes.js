const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const hospitalController = require('../controllers/hospitalController');

router.post('/add-hospitals',hospitalController.addHospitals);
router.get('/hospitals/:id',hospitalController.getHospitalsByCity);
router.get('/proxy-image',hospitalController.getImage)
router.get('/findHospital/:id',hospitalController.getHospitalData)
router.get("/getUniqueSpecialities/:hospitalId",verifyToken,hospitalController.getUniqueSpecialities);


module.exports = router;