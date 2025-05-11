require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const path = require("path");
const Hospital = require("../model/HospitalSchema");
const Doctor = require("../model/DoctorSchema")

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log("Mongodb not connected...",err);
  });



  


  const updatePendingStatus = async () => {
    try {
      const result = await Hospital.updateMany({}, { isPending: true });
      console.log(`✅ Updated ${result.modifiedCount} hospital(s) with isPending: true`);
    } catch (err) {
      console.error("❌ Error updating hospitals:", err);
    }
  };

  // updatePendingStatus()



  const updatePasswords = async () => {
    try {
      const doctors = await Doctor.find();
  
      for (let doctor of doctors) {
        // Add password only if not already set
        if (!doctor.password) {
          const hashedPassword = await bcrypt.hash("123456", 10);
          doctor.password = hashedPassword;
          await doctor.save();
          console.log(`Updated password for doctor: ${doctor.email}`);
        }
      }
  
      console.log("All doctor passwords updated.");
      process.exit();
    } catch (error) {
      console.error("Error updating passwords:", error);
      process.exit(1);
    }
  };

  // updatePasswords()



//   const specialities = ["nose", "lungs", "brain", "kidney", "liver", "eye", "heart", "ear"];

//   const getRandomSpecialities = () => {
//     const shuffled = specialities.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, Math.floor(Math.random() * 3) + 1); // Select 1 to 3 specialities
//   };
  


// const filePath = path.join(__dirname, "../jsonConvertor/filtered_hospitals.json");
// console.log(filePath)
// const rawData = fs.readFileSync(filePath);
// const hospitals = JSON.parse(rawData);

// const updatedHospitals = hospitals.map(hospital => ({
//   ...hospital,
//   Speciality: getRandomSpecialities(), // Assign random specialities
// }));


// async function insertHospitals() {
//   try {
//     await Hospital.insertMany(updatedHospitals);
//     console.log(`${updatedHospitals.length} hospitals added successfully!`);
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("Error inserting hospitals:", error);
//   }
// }

// insertHospitals();




//   const specialities = ["nose", "lungs", "brain", "kidney", "liver", "eye", "heart", "ear"];

//   const getRandomSpecialities = () => {
//     const shuffled = specialities.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, Math.floor(Math.random() * 3) + 1); // Select 1 to 3 specialities
//   };
  


// const filePath = path.join(__dirname, "../jsonConvertor/filtered_hospitals.json");
// console.log(filePath)
// const rawData = fs.readFileSync(filePath);
// const hospitals = JSON.parse(rawData);

// const updatedHospitals = hospitals.map(hospital => ({
//   ...hospital,
//   Speciality: getRandomSpecialities(), // Assign random specialities
// }));


// async function insertHospitals() {
//   try {
//     await Hospital.insertMany(updatedHospitals);
//     console.log(`${updatedHospitals.length} hospitals added successfully!`);
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("Error inserting hospitals:", error);
//   }
// }

// insertHospitals();
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../doctorsData.json"), "utf-8")
);

// Function to insert doctor data
async function insertDoctorsData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    // Insert data into the database
    const insertedDoctors = await Doctor.insertMany(doctorsData);
    console.log(`🎉 Successfully inserted ${insertedDoctors.length} doctors!`);

  } catch (error) {
    console.error("❌ Error inserting doctors:", error);
  } finally {
    // Close connection after operation
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}


// insertDoctorsData();



const updateDoctorsWithRandomRatings = async () => {
  try {
    const doctors = await Doctor.find();

    for (let doctor of doctors) {
      const randomRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1); // Generate rating between 3.5 and 5
      await Doctor.updateOne({ _id: doctor._id }, { $set: { ratings: parseFloat(randomRating) } });
      console.log(`Updated ${doctor.name} with rating: ${randomRating}`);
    }

    console.log("All doctors updated successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating doctors:", error);
    mongoose.disconnect();
  }
};

// updateDoctorsWithRandomRatings();





// const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// // Medical Degrees and Colleges
// const medicalDegrees = [
//   "MBBS", "MD (General Medicine)", "MD (Pediatrics)", "MS (Orthopedics)",
//   "DM (Cardiology)", "MCh (Neurosurgery)", "DNB (Radiology)"
// ];

// const medicalColleges = [
//   "AIIMS, Delhi", "CMC, Vellore", "AFMC, Pune", "MAMC, Delhi",
//   "JIPMER, Pondicherry", "KGMU, Lucknow", "Grant Medical College, Mumbai"
// ];

// // Generate Study Field
// const generateStudy = () => `${randomFromArray(medicalDegrees)}, ${randomFromArray(medicalColleges)}`;

// // About Templates
// const aboutTemplates = [
//   "A dedicated and compassionate doctor with a passion for patient care.",
//   "An experienced medical professional committed to excellence in healthcare.",
//   "Known for providing exceptional treatment and patient-centric care.",
//   "A specialist with years of expertise in diagnosing and treating complex cases.",
//   "Passionate about medical research and ensuring the best outcomes for patients."
// ];

// // Specialty to Body Part Mapping
// const specialtiesToBodyParts = {
//   "Cardiologist": "Heart",
//   "Neurologist": "Brain",
//   "Orthopedic": "Bones",
//   "Dermatologist": "Skin",
//   "Ophthalmologist": "Eyes",
//   "Pediatrician": "Children",
//   "Obstetrician": "Reproductive System",
//   "Oncologist": "Cancer Treatment",
//   "Gastroenterologist": "Digestive System",
//   "Nephrologist": "Kidney"
// };

// // Days of the Week for Availability
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// // Generate Random Availability Slots
// const generateRandomAvailability = () => {
//   const numDays = randomNumber(3, 5);
//   const availability = [];

//   for (let i = 0; i < numDays; i++) {
//     const day = randomFromArray(daysOfWeek);
//     const fromHour = randomNumber(9, 14);
//     const toHour = fromHour + randomNumber(2, 4);

//     availability.push({
//       day,
//       slots: [{ from: `${fromHour}:00 AM`, to: `${toHour}:00 PM` }]
//     });
//   }

//   return availability;
// };

// // Connect to MongoDB
// async function updateDoctors() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     console.log("✅ MongoDB connected successfully.");

//     const doctors = await Doctor.find();

//     for (let doctor of doctors) {
//       const specialty = doctor.specialty || "General Practitioner";
//       const bodyPart = specialtiesToBodyParts[specialty] || "General Medicine";

//       const updateFields = {
//         about: randomFromArray(aboutTemplates),
//         study: generateStudy(),
//         experience: randomNumber(5, 25),
//         consultancyFees: randomNumber(500, 2000),
//         noOfOps: randomNumber(20, 35),
//         bodyPart,
//         availability: generateRandomAvailability()
//       };

//       await Doctor.updateOne({ _id: doctor._id }, { $set: updateFields });
//       console.log(`✅ Updated Doctor: ${doctor.name}`);
//     }

//     console.log("🎉 All doctors updated successfully!");
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("❌ Error updating doctors:", error);
//     mongoose.disconnect();
//   }
// }

// updateDoctors();






// Utility Functions
// const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// // Medical Degrees and Colleges
// const medicalDegrees = [
//   "MBBS", "MD (General Medicine)", "MD (Pediatrics)", "MS (Orthopedics)",
//   "DM (Cardiology)", "MCh (Neurosurgery)", "DNB (Radiology)"
// ];

// const medicalColleges = [
//   "AIIMS, Delhi", "CMC, Vellore", "AFMC, Pune", "MAMC, Delhi",
//   "JIPMER, Pondicherry", "KGMU, Lucknow", "Grant Medical College, Mumbai"
// ];

// // About Templates
// const aboutTemplates = [
//   "A dedicated and compassionate doctor with a passion for patient care.",
//   "An experienced medical professional committed to excellence in healthcare.",
//   "Known for providing exceptional treatment and patient-centric care.",
//   "A specialist with years of expertise in diagnosing and treating complex cases.",
//   "Passionate about medical research and ensuring the best outcomes for patients."
// ];

// // Specialty to Body Part Mapping
// const specialtiesToBodyParts = {
//   "Cardiologist": "Heart",
//   "Neurologist": "Brain",
//   "Orthopedic": "Bones",
//   "Dermatologist": "Skin",
//   "Ophthalmologist": "Eyes",
//   "Pediatrician": "Children",
//   "Obstetrician": "Reproductive System",
//   "Oncologist": "Cancer Treatment",
//   "Gastroenterologist": "Digestive System",
//   "Nephrologist": "Kidney"
// };

// // Days of the Week
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// // Generate Random Availability
// const generateRandomAvailability = () => {
//   const numDays = randomNumber(3, 6); // Randomly choose between 3 to 6 working days
//   const selectedDays = daysOfWeek.slice(0, numDays);
//   const availability = [];

//   for (let day of selectedDays) {
//     const slotType = randomNumber(1, 2); // Randomly decide 1 or 2 slots per day
//     const fromHour1 = randomNumber(9, 12);
//     const toHour1 = fromHour1 + randomNumber(1, 3);

//     const slots = [{ from: `${fromHour1}:00 AM`, to: `${toHour1}:30 AM` }];

//     if (slotType === 2) {
//       const fromHour2 = randomNumber(2, 5);
//       const toHour2 = fromHour2 + randomNumber(2, 3);
//       slots.push({ from: `${fromHour2}:00 PM`, to: `${toHour2}:00 PM` });
//     }

//     availability.push({ day, slots });
//   }

//   return availability;
// };

// // Connect to MongoDB and Update
// async function updateDoctors() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     console.log("✅ MongoDB connected successfully.");

//     const doctors = await Doctor.find();

//     for (let doctor of doctors) {
//       const specialty = doctor.specialty || "General Practitioner";
//       const bodyPart = specialtiesToBodyParts[specialty] || "General Medicine";

//       const updateFields = {
//         about: randomFromArray(aboutTemplates),
//         qualification: `${doctor.qualification}, ${randomFromArray(medicalColleges)}`, // Append college name
//         experience: randomNumber(5, 25),
//         consultancyFees: randomNumber(500, 2000),
//         noOfOps: randomNumber(20, 35),
//         bodyPart,
//         availability: generateRandomAvailability()
//       };

//       // Remove `study` field completely
//       await Doctor.updateOne({ _id: doctor._id }, { $set: updateFields, $unset: { study: "" } });
//       console.log(`✅ Updated Doctor: ${doctor.name}`);
//     }

//     console.log("🎉 All doctors updated successfully!");
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("❌ Error updating doctors:", error);
//     mongoose.disconnect();
//   }
// }

// updateDoctors();


// const specializationsList = [
//   "Cardiologist", "Neurologist", "Dentist", "Dermatologist", "Endocrinologist",
//   "Pediatrician", "Obstetrician", "Psychiatrist", "Gynecologist", "Ophthalmologist",
//   "Pulmonologist", "Hematologist", "General Surgeon", "Orthopedic Surgeon"
// ];



// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log("MongoDB connected!");

//     try {
//       // ✅ Update all hospitals with the specializations list
//       const result = await Hospital.updateMany({}, { $set: { specializations: specializationsList } });
//       console.log(`Updated ${result.modifiedCount} hospitals with specializations.`);
//     } catch (error) {
//       console.error("Error updating hospitals:", error);
//     } finally {
//       mongoose.connection.close();
//     }
//   })
//   .catch(err => console.log("MongoDB connection failed:", err));






const specialtyToBodyPart = {
  "Pulmonologist": "Lungs",
  "Hematologist": "Blood",
  "General Surgeon": "General",
  "Endocrinologist": "Hormones"
};

// ✅ Function to Update Doctors
const updateDoctorsBodyPart = async () => {
  try {
    console.log("🔄 Updating doctors' bodyPart based on specialty...");

    // ✅ Update Doctors' bodyPart based on specialty
    const result = await Doctor.updateMany(
      { specialty: { $in: Object.keys(specialtyToBodyPart) } }, // Find matching specialties
      [
        {
          $set: {
            bodyPart: { $switch: { // Dynamically set bodyPart
              branches: Object.entries(specialtyToBodyPart).map(([specialty, bodyPart]) => ({
                case: { $eq: ["$specialty", specialty] },
                then: bodyPart
              })),
              default: "$bodyPart" // Keep existing value if no match
            }}
          }
        }
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} doctors.`);
  } catch (error) {
    console.error("❌ Error updating doctors:", error);
  }
};






// updateDoctorsBodyPart()





const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateRandomAvailability = () => {
  let availability = [];
  let assignedDays = new Set();

  // Decide whether to assign full week or only a few random days
  const isFullWeek = Math.random() > 0.5; // 50% chance of full week availability

  if (isFullWeek) {
    assignedDays = new Set(daysOfWeek);
  } else {
    let numberOfDays = Math.floor(Math.random() * 4) + 2; // Assign availability for 2-5 random days
    while (assignedDays.size < numberOfDays) {
      assignedDays.add(daysOfWeek[Math.floor(Math.random() * 7)]);
    }
  }

  assignedDays.forEach(day => {
    const hasFullDaySlots = Math.random() > 0.5; // 50% chance of having both morning & afternoon

    let slots = [];
    if (hasFullDaySlots || Math.random() > 0.5) {
      slots.push(...["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]);
    }
    if (hasFullDaySlots || Math.random() > 0.5) {
      slots.push(...["2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"]);
    }

    availability.push({ day, slots });
  });

  return availability;
};

const updateDoctorsAvailability = async () => {
  try {
    const doctors = await Doctor.find();
    
    for (const doctor of doctors) {
      const newAvailability = generateRandomAvailability();
      await Doctor.updateOne({ _id: doctor._id }, { $set: { availability: newAvailability } });
    }

    console.log("Doctors' availability updated successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating doctors:", error);
    mongoose.connection.close();
  }
};

// updateDoctorsAvailability();




// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const updateDoctorAvailability = async () => {
//   try {
//     const doctors = await Doctor.find();
//     for (let doctor of doctors) {
//       let updatedAvailability = doctor.availability.map((entry) => ({
//         ...entry,
//         available: Math.random() > 0.3, // 70% chance of availability
//       }));

//       await Doctor.updateOne({ _id: doctor._id }, { availability: updatedAvailability });
//       console.log(`Updated availability for Dr. ${doctor.name}`);
//     }

//     console.log("✅ All doctor records updated successfully!");
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("❌ Error updating doctor records:", error);
//     mongoose.connection.close();
//   }
// };

// updateDoctorAvailability();




const addRoleToDoctors = async () => {
  try {
    const result = await Doctor.updateMany(
      { role: { $exists: false } }, // only if role doesn't exist
      { $set: { role: "doctor" } }
    );
    console.log("Doctors updated:", result.modifiedCount);
  } catch (err) {
    console.error("Error updating doctors:", err);
  }
};

// addRoleToDoctors();

