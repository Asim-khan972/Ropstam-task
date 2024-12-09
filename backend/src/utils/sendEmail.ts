import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  name: string,
  randomPassword: string,
) => {
  console.log(
    "SMTP Settings:",
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
  );

  // HTML email content with dynamic name and password
  const emailText = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #5a5a5a;">Welcome to Our App, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">
            We're excited to have you onboard. Below is your login information:
          </p>
          <p style="font-size: 16px; color: #555;">
            <strong>Your login password is:</strong><br>
            <span style="font-size: 18px; color: #007bff; font-weight: bold;">${randomPassword}</span>
          </p>
          
          <footer style="margin-top: 30px; font-size: 14px; text-align: center; color: #888;">
            <p>Thank you for joining us!</p>
            <p>&copy; ${new Date().getFullYear()} Our App</p>
          </footer>
        </div>
      </body>
    </html>
  `;

  // Create a transporter object using SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // Use true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send the email with the HTML content
  await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_USER}>`,
    to,
    subject: "Welcome to Our App",
    html: emailText, // Use 'html' to send HTML formatted email
  });
};
