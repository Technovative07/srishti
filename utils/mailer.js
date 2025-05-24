import nodemailer from "nodemailer";


 
const transporter = nodemailer.createTransport({
  service: "gmail",  
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.EMAIL_PASS      
  }
});

 
const sendMail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Hospital Copilot" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.response);
    return result;
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
};

module.exports = sendMail;
