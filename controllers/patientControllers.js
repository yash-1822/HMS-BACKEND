const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");
const OTP = require("../model/OtpSchema");
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const Appointment = require("../model/AppointmentSchema");
const Doctor = require("../model/DoctorSchema")

const nodemailer = require("nodemailer");

// Configure transporter for email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // Your email address
    pass: process.env.EMAIL_PASSWORD,  // Your email app password
  },
});

// Register new user and send confirmation email
const register = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { name, phone, address, email, password, confirmPassword, role } = req.body;

    // Validation checks
    if (!name || !phone || !address || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = new User({
      name,
      phone,
      location: address,
      email,
      password,
      role: role || "patient",
      status: "Pending",  // You can change this status based on your approval system
    });

    await newUser.save();

    // Send confirmation email to the registered user
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,      // Sender email
    //   to: email,                         // Recipient email
    //   subject: "Welcome to Hospital Management System",
    //   text: `Hi ${name},\n\nThank you for registering! Your account is currently pending approval.\n\nRegards,\nHospital Management Team`,
    // };

    // await transporter.sendMail(mailOptions);

    // Respond back with success
    return res.status(201).json({ message: "User registered successfully and email sent", newUser });

  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);

    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(400).json({ error: "User not found" });
    }

    console.log(userDetails.password,password);
    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const tokenData = {
      _id: userDetails._id,
      email: userDetails.email,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "8h",
    });

    res.status(200).json({
      message: "Login successful",
      token, // ⬅️ send token in response body
      user: {
        _id: userDetails._id,
        email: userDetails.email,
        name: userDetails.name,
      },
      expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// module.exports = login;



// Check token validity
const checkToken = async (req, res) => {
  res.status(200).json({ message: "Valid token", user: req.user });
};

// Send OTP for phone verification
const sendOTP = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { numbers } = req.body;

    const phoneNumber = numbers.toString();

    // Check if user exists
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999);

    // Store OTP in DB (valid for 5 minutes)
    await OTP.create({ phone: phoneNumber, otp: otpCode, expiresAt: Date.now() + 300000 });

    // Send OTP using Fast2SMS service
    const apiKey = process.env.FAST2SMS_API_KEY;
    const message = `OTP for login is ${otpCode}. It is valid for 5 minutes.`;

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        message: message,
        language: "english",
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: apiKey,
        },
      }
    );

    // Check if OTP was sent successfully
    if (response.data.return) {
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout functionality
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "Logged out successfully",
      error: false,
      success: true,
      data: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send confirmation email (you can use this as needed)
const sendConfirmationMail = async (req, res) => {
  try {
    // const { email, name } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret key

    const { email } = decoded;

    console.log("email is",email)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Approved",
      text: `Hi Appointment has been approved.\nYou can now access the Hospital Management System.\n\nRegards,\nHospital Management Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Confirmation email sent successfully" });

  } catch (error) {
    console.error("Error in sending confirmation email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAppointments = async(req,res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
          return res.status(401).json({ message: 'Token missing' });
        }
    
        const decoded = jwt.decode(token); // decoding without verification
        const userEmail = decoded?.email;
    
        if (!userEmail) {
          return res.status(400).json({ message: 'Invalid token payload' });
        }
    
        const appointments = await Appointment.find({ userEmail }).sort({ slotDate: 1 });
    
        const appointmentsWithDoctorData = await Promise.all(
          appointments.map(async (appointment) => {
            const doctor = await Doctor.findOne({ email: appointment.docData.email });
    
            return {
              ...appointment.toObject(),
              docData: doctor, // full doctor object added here
            };
          })
        );
    
        res.status(200).json(appointmentsWithDoctorData.reverse());
      } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
      }
    
}


const getUserDetails = async(req,res) => {
    try {
        const token = req.headers.authorization;

        console.log("token is",token);
    
        if (!token) {
          return res.status(401).json({ message: "No token provided." });
        }
    
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
    
        const user = await User.findById(decoded._id).select("-password");
    
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
    
        res.status(200).json(user);
      } catch (err) {
        console.error("Token decode error:", err);
        res.status(401).json({ message: "Invalid token." });
      }
}


const getUserDetailsWhileLogin = async(req,res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Removes 'Bearer'
    
      console.log("token is",token)
  
      if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }
  
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
  
      const user = await User.findById(decoded._id)
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Token decode error:", err);
      res.status(401).json({ message: "Invalid token." });
    }
}

const updateUserDetails = async(req,res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Removes 'Bearer'
  
      if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }
  
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
  
      const user = await User.findById(decoded._id)
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
    const { email, phone, gender, age, address } = req.body;

    const updatedPatient = await User.findByIdAndUpdate(
      user,
      {
        email,
        phone,
        gender,
        age,
        address,
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', data: updatedPatient });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }

}


const updateUserImage = async(req,res) => {
  try {

     const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Removes 'Bearer'
  
      if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }
  
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
  
      const userId = await User.findById(decoded._id)
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: user.profileImage,
    });
  } catch (error) {
    console.error("Update image error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const cancelAppointment = async(req,res) => {
    try {
        const { id } = req.params;
        await Appointment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Appointment cancelled' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error cancelling appointment' });
      }
}

module.exports = {updateUserImage,updateUserDetails,getUserDetailsWhileLogin, register,cancelAppointment,login,getAppointments, sendOTP,getUserDetails, checkToken, logout, sendConfirmationMail };
