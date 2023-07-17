const { EMAIL, PASSWORD } = require('../config');
const nodemailer = require("nodemailer");
var Mailgen = require('mailgen');
// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

registerMail = async (req, res) => {
    var { useremail, username, subject, text } = req.body;

    try {
        let config = {
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        }
        const transporter = await nodemailer.createTransport(config);
        console.log("hello11");
        var email = {
            body: {
                name: username,
                intro: 'Welcome to My App! We\'re very excited to have you on board.',
                action: {
                    instructions: 'To get started with Mailgen, please click here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: text,
                        link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        var emailBody = mailGenerator.generate(email);

        const data = {
            "from": EMAIL,
            "to": useremail,
            "subject": subject || "Thank you for signing up",
            "html": emailBody
        }
        transporter.sendMail(data).then(info => {
            return res.send(info.response);
        })


    } catch (err) {
        return res.status(404).send("Cant send mail!");
    }

}
module.exports = registerMail