
const User = require('../model/ResetPasswordModel');
const { Sequelize } = require('sequelize');



async function clearOldOtp(){
    const timeBefore = new Date();

    const result = await User.update(
        { otp: null, expiry: null },
        { where: { expiry: { [Sequelize.Op.lt]: timeBefore } } }
    );

    console.log(`Cleared otps in these rows:- ${result}`, timeBefore);
}

module.exports = { clearOldOtp }