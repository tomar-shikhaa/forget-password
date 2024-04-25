// PasswordController.js

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const userData = require("../model/ResetPasswordModel"); // Assuming you have a user model
const Mailgen  = require("mailgen"); // Import Mailgen
const bcrypt = require("bcrypt"); // Import
const crypto = require("crypto");
require('dotenv').config()
const key = "xyz"
// const key = 'secretkey'
const createToken = (userId, expiry='1h') => {
    return jwt.sign({ userId }, key, { expiresIn: expiry });
};

const createuser = async (req, res) => {
    try {
        const { UserName, Email, Password } = req.body;
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        const newUser = await userData.create({ UserName, Email, Password: hashedPassword });
        
        // Generate JWT token
        const token = createToken(Email);
        res.cookie('token', token,{httpOnly: true});
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await userData.findOne({ where: { Email } });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = createToken(user.id);
        
        res.cookie('token', token,{httpOnly: true});
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const SendMail = async (Email, otp) => {
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
 
    user: 'hunugupta1@gmail.com', // Gmail account used for sending emails
   pass: 'wjmlzrkqpjxprmvu', // Password for the Gmail account
    }
  });

// Create Mailgen instance
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "YourApp",
    link: "https://yourapp.com/",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

  const emailTemplate = {
    body: {
      name: `${Email}`,
      intro: "You requested to reset your Password. Here is your OTP:",
      action: {
        instructions: "Please use the following OTP to reset your Password:",
        button: {
          color: "#DC4D2F",
          text: otp,
        },
      },
      outro: "If you did not request this, please ignore this Email.",
    },
  };


  // Generate HTML from the template
  const emailBody = mailGenerator.generate(emailTemplate);

  return transporter.sendMail({
    from: "st9454869@gmail.com",
    to: Email,
    subject: "Reset Password",
    html: emailBody,
  });
};

// const sendMail = async (mailOptions) => {
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.response);
//     return info;
//   } catch (error) {
//     console.error("Error sending Email:", error);
//     throw new Error("Failed to send Email");
//   }
// };

const forgetPassword = async (req, res) => {
  const { Email } = req.body;
  try {
    const user = await userData.findOne({ where: { Email } });
    if (!user) {
      return res.status(404).json({ message: "User not exist" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 1 hour
    const otpHash = await bcrypt.hash(otp, 10);
    await user.update({otp: otpHash, expiry});
    const result = await SendMail(Email, otp);
    res.json({ result: result.messageId, message: "Email sent successfully" });
  
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { Password, Email, otp } = req.body;

  try {
    
    // Find user by OTP
    const user = await userData.findOne({where: {Email} });

    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (user.otp !== null){
      const otpMatch = await bcrypt.compare(otp, user.otp);
      if(otpMatch && new Date() < user.expiry) {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await user.update({ Password: hashedPassword, otp: null, expiry: null });
        return res.status(200).json({message: "password changed"});
    }
  }
  return res.status(400).json({message: "invalid  or expired otp password"});

  } catch (error) {
    //console.error("Error resetting Password:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createuser, login, forgetPassword, resetPassword };