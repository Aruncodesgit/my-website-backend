// const mongoose = require('mongoose'); 

// const Contact = require('./contact.model');
// var nodemailer = require('nodemailer');


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass:  process.env.EMAIL_PASS,
//     }
// })

// //post contact 
// module.exports.contact = async (req, res, next) => {

//     try {

//         const contact = new Contact({
//             name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     message: req.body.message
//         });
//         var mailOptions = {
//                     from: process.env.EMAIL_USER,
//                     to: process.env.EMAIL_USER,
//                     subject: 'Website Requirement',
                    
                
//         }
        
//         const doc = await contact.save();
//         if(doc){
//              transporter.sendMail(mailOptions, function (error, info) {
//                     if (error)
//                         console.log(error);
//                     //else
//                     //console.log('Email Sent:' + info.response);
//                 })
//         }

//         res.status(201).send(doc);

//     } catch (err) {

//         next(err);

//     }

// };



const Contact = require("./contact.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST contact
module.exports.contact = async (req, res, next) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        });

        const doc = await contact.save();

        /* const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Website Requirement",
            html: `
                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center">

                <table width="650" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:650px; width:100%; background:#ffffff;
                    border-radius:12px; overflow:hidden;background:#f4f6f8; font-family:Arial, sans-serif;
                    border:1px solid #e5e7eb;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#1f2937; padding:30px 30px;">

                            <div style="font-size:13px; color:#1f7399;
                                font-weight:bold; letter-spacing:1px;
                                text-transform:uppercase;">
                                New Enquiry
                            </div>

                            <div style="font-size:26px; color:#ffffff;
                                font-weight:bold; margin-top:8px;">
                                Website Requirement
                            </div>

                            <div style="font-size:14px; color:#d1d5db;
                                margin-top:8px;">
                                You have received a new website enquiry.
                            </div>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:30px;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">

                                <!-- Name -->
                                <tr>
                                    <td width="30%" style="padding:14px 0;
                                        color:#6b7280; font-size:13px;
                                        font-weight:bold;">
                                        NAME
                                    </td>

                                    <td style="padding:14px 0;
                                        color:#111827; font-size:15px;
                                        font-weight:bold;">
                                        ${req.body.name}
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2">
                                        <div style="height:1px; background:#eeeeee;"></div>
                                    </td>
                                </tr>

                                <!-- Email -->
                                <tr>
                                    <td width="30%" style="padding:14px 0;
                                        color:#6b7280; font-size:13px;
                                        font-weight:bold;">
                                        EMAIL
                                    </td>

                                    <td style="padding:14px 0;
                                        color:#111827; font-size:15px;">
                                        <a href="mailto:${req.body.email}"
                                            style="color:#1f7399;
                                            text-decoration:none;">
                                            ${req.body.email}
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2">
                                        <div style="height:1px; background:#eeeeee;"></div>
                                    </td>
                                </tr>

                                <!-- Phone -->
                                <tr>
                                    <td width="30%" style="padding:14px 0;
                                        color:#6b7280; font-size:13px;
                                        font-weight:bold;">
                                        PHONE
                                    </td>

                                    <td style="padding:14px 0;
                                        color:#111827; font-size:15px;">
                                        ${req.body.phone}
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2">
                                        <div style="height:1px; background:#eeeeee;"></div>
                                    </td>
                                </tr>

                                <!-- Message -->
                                <tr>
                                    <td colspan="2" style="padding-top:25px;">

                                        <div style="font-size:13px;
                                            color:#6b7280;
                                            font-weight:bold;
                                            margin-bottom:10px;">
                                            MESSAGE
                                        </div>

                                        <div style="background:#f9fafb;
                                            border:1px solid #e5e7eb;
                                            border-radius:8px;
                                            padding:18px;
                                            color:#374151;
                                            font-size:14px;
                                            line-height:1.7;">
                                            ${req.body.message}
                                        </div>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f9fafb;
                            border-top:1px solid #eeeeee;
                            padding:20px 30px;
                            text-align:center;">

                            <div style="font-size:12px; color:#9ca3af;">
                                This enquiry was submitted through your website.
                            </div>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
                `
        };

         console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
         console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

       await transporter.verify();

        console.log("Gmail SMTP connection successful");

        const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId); */

        return res.status(201).json({
            success: true,
            message: "Contact saved and email sent successfully",
            data: doc
        });

    } catch (err) {
        console.error("CONTACT ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Contact saved/processing failed",
            error: err.message
        });
    }
};
