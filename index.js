import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// ✅ Fixed Gmail credentials (sender)
const SENDER_EMAIL = "piyush.pb.2005@gmail.com";           // your Gmail
const SENDER_PASS = "qzvc dnqv ednt zcyt";              // app password from Google

// ✅ Fixed recipient email (who receives all reports)
const RECEIVER_EMAIL = "piyushbhardwaj418@gmail.com";            // doctor or clinic Gmail

// ✅ Root check route
app.get("/", (req, res) => {
  res.send("✅ Gmail Relay Server is running and ready.");
});

// ✅ ESP32 endpoint
app.post("/send-report", async (req, res) => {
  const { name, date, time, forward, backward, total } = req.body;

  if (!name || !date || !time) {
    return res.status(400).send("Missing required fields");
  }

  console.log("📨 Report received from ESP32:", req.body);

  try {
    // 🔧 Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASS,
      },
    });

    // 📨 Email content
    const mailOptions = {
      from: `"Motor Control System" <${SENDER_EMAIL}>`,
      to: RECEIVER_EMAIL,
      subject: `Patient Session Report - ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif; padding:15px; background:#f9f9f9;">
          <h2 style="color:#007bff;">Motor Control Session Summary</h2>
          <p><b>Patient Name:</b> ${name}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Time:</b> ${time}</p>
          <p><b>Forward Turns:</b> ${forward}</p>
          <p><b>Backward Turns:</b> ${backward}</p>
          <p><b>Total Duration:</b> ${total} seconds</p>
          <hr style="margin:15px 0;"/>
          <p style="font-size:13px; color:#555;">
            Sent automatically by the ESP32 Motor Control System 🦾
          </p>
        </div>
      `,
    };

    // 🚀 Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.status(200).send("✅ Email sent successfully via Gmail");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    res.status(500).send("Email send failed: " + err.message);
  }
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Gmail relay running on port ${PORT}`));
