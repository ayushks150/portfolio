// routes/router.js

import express from "express";
import User from "../models/userSchema.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// Register user details
router.post("/register", async (req, res) => {
  const { fname, lname, email, mobile, message } = req.body;

  try {
    // Validate required fields
    if (!fname || !lname || !email || !mobile || !message) {
      return res.status(400).json({ error: "All input fields are required" });
    }

    // Check if user with the same email already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, save message and send email
      await user.Messagesave(message);

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending email using Node.js",
        text: "Your response has been submitted"
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        }
        console.log("Email sent:", info.response);
        res.status(201).json({ message: "Email sent successfully" });
      });
    } else {
      // User does not exist, create new user and save message
      user = new User({
        fname,
        lname,
        email,
        mobile,
        messages: [{ message }]
      });

      await user.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending email using Node.js",
        text: "Your response has been submitted"
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        }
        console.log("Email sent:", info.response);
        res.status(201).json({ message: "Email sent successfully" });
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
