const express = require ("express")
const sequalize = require('./config/mysql')
const route = require('./route/Routes')
const otproute = require('./route/ResetPasswordRoute') //
const bodyParser = require("body-parser");

require('dotenv').config()

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const port = 2000;
const path = require('path')
const{I18n} = require('i18n')
const cookieParser = require('cookie-parser');

const i18n = new I18n({
        locales: ['en', 'hi', 'guj'], // Supported languages
        directory: path.join( __dirname + '/translation'), // Directory where your locale files reside
        defaultLocale: 'hi', // Default language

    
})

// app.post("/send-email", sendMail);


app.use(i18n.init)
app.use(cookieParser())
app.use('/', route, otproute)
sequalize.sync().then(() => {
    console.log('Synced with DB');
}).catch((error) => {
    console.error('Unable to sync with DB:', error);
});
app.listen(port, ()=>{
    console.log(`server started ${port}`);
})