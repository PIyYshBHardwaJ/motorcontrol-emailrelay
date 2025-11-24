
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ Replace these values accordingly
const RESEND_API_KEY = "re_Y1H69ssa_JLp5gtKpAurAUeoTdNSZ44xo";
const RECEIVER_EMAIL = "unhardik@gmail.com";
const SENDER_EMAIL = "onboarding@resend.dev"; // any verified sender email

// 📩 Route to receive ESP32 report and send email
app.post("/send-report", async (req, res) => {
  const { name, email, date, time, contraction, expansion, total, expanded } = req.body;

  console.log("📨 Report received from ESP32:", req.body);

  // 🧾 Updated Email Body with Expansion
  const emailBody = `
    <h2>Motor Control Session Summary</h2>
    <p><b>Patient Name:</b> ${name}</p>
    <p><b>Patient Email:</b> ${email}</p>
    <p><b>Date:</b> ${date}</p>
    <p><b>Time:</b> ${time}</p>
    <p><b>Contraction Turns:</b> ${contraction}</p>
    <p><b>Expansion Turns:</b> ${expansion}</p>
    <p><b>Total Time:</b> ${total} seconds</p>
    <p><b>Expanded:</b> ${expanded} mm</p>
  `;

  try {
    // 🚀 Send via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [RECEIVER_EMAIL],
        subject: `Patient Report - ${name}`,
        html: emailBody,
      }),
    });

    const text = await response.text();
    console.log("✅ Resend response:", response.status, text);
    res.status(200).send("✅ Report received. Email sent via Resend.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("❌ Failed to send email.");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Resend Gmail relay running on port ${PORT}`));

