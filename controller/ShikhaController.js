const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/ShikhaModel');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
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
        
        const newUser = await User.create({ UserName, Email, Password: hashedPassword });
        
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
        const user = await User.findOne({ where: { Email } });
        
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

const getalluser = async (req, res) => {
    try {
        const getuser = await User.findAll();
        res.status(200).json(getuser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// ---------nodemailer--------------------------------

const sendMail = async (Email, token) => {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
        //   user: process.env.USER_MAIL, // Gmail account used for sending emails
        //   pass: process.env.USER_PASSWORD, // Password for the Gmail account

        user: 'hunugupta1@gmail.com', // Gmail account used for sending emails
       pass: 'wjmlzrkqpjxprmvu', // Password for the Gmail account
        }
      });
  
      // Create a Mailgen instance for generating HTML email content
      const mailGenerator = new Mailgen({
        theme: "salted", // Specify the theme for the email (can be customized)
        product: {
          name: "Your App", // Name of your application
          link: "https://yourapp.com/" // Link to your application
        }
      });
  
      // Define the content structure of the email
      const emailContent = {
        body: {
          name:  `${Email}`, // Use provided name or default to "User"
          intro: "Reset Password", // Introduction text of the email
          action: {
            instructions: "To Reset Password click below", // Instructions for the action
            button: {
              color: "#FF3838", // Color of the button
              text: "forget password", // Text displayed on the button
              link: `http://localhost:2000/reset?token=${token}`// Link the button directs to
            // link: `http://localhost:/redirect?token=${token}`// Link the button directs to

            }
          },
          outro: "If you have any further concerns or questions, feel free to reply to this email. I appreciate your understanding." // Closing text of the email
        }
      };
  
      // Generate the HTML content of the email using Mailgen
      const emailBody = mailGenerator.generate(emailContent);
  
      // Send the email using nodemailer transporter  
      let info = await transporter.sendMail({
        from: 'shrikanttechies111223@gmail.com', // Sender information
        to:Email, // Recipient's email address
        subject: "Reset password", // Subject of the email
        text: "This a reset password link", // Plain text version of the email
        html: emailBody, // HTML version of the email generated by Mailgen
      });
  
    };

    const forgetPassword = async (req, res) => {
        const {Email} = req.body;
        try {
            const outUser = await User.findOne({where: {Email} });
            if (!outUser) {
                return res.status(400).json({ message: "Username does not exist" });
            }
    
            const token = createToken(Email, '60m');
           // const result = await sendMail(Email, token);
           await sendMail(Email, token);
            // res.json({ result: result.messageId, message: "Email sent successfully" });
            res.json({ message: "Email sent successfully" });
    
        } catch (error) {
            console.error("Error sending email:",error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    


const Resetoutput = async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'Please Sign in first' });
    }
     res.cookie('token', token, { httpOnly: true }).status(200).json({
        message: "Now you can reset your password"
        
    });
};



const ResetPass = async (req, res) => {
    try {
        const {token} = req.cookies;
        const { Password } = req.body
        const decoded = jwt.verify(token, key);
        const hashedPass = await bcrypt.hash(Password, 10);
        await User.update({ Password: hashedPass }, { where: { Email: decoded.userId } });
        res.status(200).json({ message: res.__('prod_update_message') });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
  
  












// const findone = async (req, res) => {
//     try {
//         // const userId = req.param;
//         const getone = await User.findOne({ where: { Email} });
//         if (getone) {
//             res.status(200).json(getone);
//         } else {
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const findpk = async (req, res) => {
    try {
        const userId = req.params.id;
        const getpk = await User.findByPk(userId);
        if (getpk) {
            res.status(200).json(getpk);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateuser = async (req, res) => {
    try {
        const { UserName, Email, Password } = req.body;
        const userId = req.params.id;
        const updated = await User.update({ UserName, Email, Password }, { where: { id: userId }, returning: true });
        if (updated) {
            res.status(200).json({ message: "User updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





const deleteuser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await User.destroy({ where: { id: userId } });
        if (deleted) {
            res.status(200).json({ message: res.__("delete")});
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { createuser, login,  getalluser, findpk, updateuser, deleteuser, sendMail, forgetPassword, Resetoutput, ResetPass };
