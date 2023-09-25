import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars = require("handlebars");
import path = require("path");

let transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e1acda58843417",
    pass: "18246c2bc082e0",
  },
});

export const sendOTPEmail = (to: string, otp: string) => {
  const filePath = path.join(__dirname, "..", "html/otp.html");
  const source = fs.readFileSync(filePath, "utf8");
  const template = Handlebars.compile(source);
  const replacements = {
    otp,
  };
  const htmlToSend = template(replacements);
  let mailOptions = {
    from: "otp@rydeshare.com",
    to: to,
    subject: "one time verification code",
    text: "Your OTP is: " + otp,
    html: htmlToSend,
  };

  try {
    transport.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
