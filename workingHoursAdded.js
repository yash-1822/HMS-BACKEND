const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();



const filePath = path.join(__dirname, "doctorsData.json"); // Path to JSON file
console.log("filepath is",filePath)

// Different working hour templates
const workingHourSets = [
  "Monday:[10 AM - 6 PM],Tuesday:[10 AM - 6 PM],Wednesday:[10 AM - 6 PM],Thursday:[10 AM - 6 PM],Friday:[10 AM - 6 PM],Saturday:[10 AM - 2 PM],Sunday:[Closed]",
  "Monday:[8 AM - 2 PM],Tuesday:[8 AM - 2 PM],Wednesday:[8 AM - 2 PM],Thursday:[8 AM - 2 PM],Friday:[8 AM - 2 PM],Saturday:[9 AM - 12 PM],Sunday:[Closed]",
  "Monday:[2 PM - 8 PM],Tuesday:[2 PM - 8 PM],Wednesday:[2 PM - 8 PM],Thursday:[2 PM - 8 PM],Friday:[2 PM - 8 PM],Saturday:[10 AM - 4 PM],Sunday:[Closed]",
  "Monday:[10 AM - 6 PM],Wednesday:[10 AM - 6 PM],Friday:[10 AM - 6 PM],Saturday:[9 AM - 1 PM],Sunday:[Closed]",
  "Saturday:[9 AM - 5 PM],Sunday:[9 AM - 3 PM]",
  "Monday:[9 AM - 1 PM],Tuesday:[Closed],Wednesday:[3 PM - 7 PM],Thursday:[Closed],Friday:[9 AM - 1 PM],Saturday:[Closed],Sunday:[Closed]"
];

// Function to assign random working hours
const getRandomHours = () => {
  return workingHourSets[Math.floor(Math.random() * workingHourSets.length)];
};

// Read JSON file, update it, and save it
fs.readFile(filePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  let doctors = JSON.parse(data);

  // Add "Hours" field with random selection
  doctors = doctors.map(doctor => ({
    ...doctor,
    Hours: getRandomHours()
  }));

  // Save updated JSON file
  fs.writeFile(filePath, JSON.stringify(doctors, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Updated JSON file saved successfully!");
    }
  });
})