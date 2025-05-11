// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 8000;
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// require("dotenv").config(); 
// require("../db/conn")


// app.use(
//     cors({
//       origin: "http://localhost:5173", // ✅ Explicitly allow frontend origin
//       credentials: true, // ✅ Allow cookies & authentication
//     })
//   );



//   app.use(express.json());

//   app.use(cookieParser())

// const patientRoutes = require('../routes/patientRoutes');
// const hospitalRoutes = require('../routes/hospitalRoutes')
// const doctorRoutes = require('../routes/doctorRoutes')

// // const doctorRoutes = require('../routes/doctorRoutes');

// app.use('/patient',patientRoutes);
// app.use('/hospital',hospitalRoutes);
// app.use('/doctors',doctorRoutes);



// async function startServer(){
//     try{
//         app.listen(PORT,() => {
//             console.log(`Server is running on port ${PORT}`);
//         })
//     }
//     catch(error){
//         console.log("Error while strting server is:",error);
//     }
// }

// startServer();








const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");

require("dotenv").config();
require("../db/conn");

// ✅ Allow all origins and Authorization headers (for JWT)
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'], // Allow JWT tokens
  allowedHeaders: ['Content-Type', 'Authorization', 'aToken', 'dToken'],
}));

app.options('*', cors());

app.use(express.json()); // ✅ Parse JSON requests



// ✅ Routes
const patientRoutes = require('../routes/patientRoutes');
const hospitalRoutes = require('../routes/hospitalRoutes');
const doctorRoutes = require('../routes/doctorRoutes');

//adminRoutes
const adminDoctorRoutes = require('../routes/adminDoctorsRoute')
const hospitalAdminRoutes = require('../routes/hospitalAdminRoutes')
const superAdminRoutes = require('../routes/superAdminRoutes')



//patient,hospital,doctors
app.use('/patient', patientRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctors', doctorRoutes);

//admin
app.use('/adminDoctor',adminDoctorRoutes);
app.use('/hospitalAdmin',hospitalAdminRoutes)
app.use('/superAdmin',superAdminRoutes)


async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("❌ Error while starting server:", error);
  }
}

startServer();
