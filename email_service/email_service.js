//Lift in nodemailer and nodemailerSendgrid.
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
require("dotenv").config();

/* Set up a transport constant, that holds a method from nodemailer.
 This method is used to set up a connection to our email-server (sendgrid). */
const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_KEY,
    })
);

//Here we build the mail. The content will be a div containing a h2 and a p.
const sendACardByEmail = (mantra) => {
    transport
    .sendMail({
        from: "Emma <emma.livscoach@gmail.com>",
        to: `emma.livscoach@gmail.com`,
        subject: "A new mantra!",
        html: `<div style="background-color: ${mantra.cardColor}"><h2>${mantra.mantraText}</h2><h4>${mantra.date}</h4><h4></h4></div>`
    })
    .then(() => {console.log("Mail sent!")})
    .catch((err) => console.log(err));
};

exports.sendACardByEmail = sendACardByEmail;

