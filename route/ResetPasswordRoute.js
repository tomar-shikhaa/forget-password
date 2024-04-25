// routes/authRouter.js

const express = require('express');
const authController = require('../controller/ResetPasswordController');

const router = express.Router();


router.post('/signin',  authController.createuser);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgetPassword);

router.patch('/reset-password', authController.resetPassword);

module.exports = router;
