const cron = require('node-cron');
const { clearOldOtp } = require("./Task")


cron.schedule('* * * * *', () => {
    console.log('Checking and clearing old OTPs...');
    clearOldOtp();
});

