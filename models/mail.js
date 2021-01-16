var nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // True for 465, false for other ports
    auth: {
        // type: 'OAuth2',
        user: 'alexandrabachicha@gmail.com',
        pass: 'testAcccount.pass'
        // accessToken: ''
        // user: process.env.EMAIL, // Generated ethereal user
        // pass: process.env.PASSWORD, // Generated ethereal password
    }
});

// transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
//     let accessToken = userTokens[user];
//     if(!accessToken){
//         return callback(new Error('Unknown user'));
//     }else{
//         return callback(null, accessToken);
//     }
// });

// Send mail with defined transport object
var mailOptions = {
    from: 'alexandrabachicha@gmail.com', // Sender 
    to: 'receiver@sever.com', // Receiver(s)
    subject: 'Subject', // Subject line
    text: 'Hello!', // Text body
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent successfully!');
    }
})