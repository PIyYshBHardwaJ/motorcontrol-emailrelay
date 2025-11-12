import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const RESEND_API_KEY = "re_GD94N3Fn_DTpASLuydz2SRhZvC4U9qNag";
const RECEIVER_EMAIL = "piyushbhardwaj418@gmail.com";
const SENDER_EMAIL = "piyush.pb.2005@gmail.comn"; // any valid sender

app.post("/send-report", async (req, res) => {
  const { name, date, time, forward, backward, total } = req.body;

  console.log("📨 Report received from ESP32:", req.body);

  const emailBody = `
    <h2>Motor Control Session Summary</h2>
    <p><b>Patient:</b> ${name}</p>
    <p><b>Date:</b> ${date}</p>
    <p><b>Time:</b> ${time}</p>
    <p><b>Forward:</b> ${forward}</p>
    <p><b>Backward:</b> ${backward}</p>
    <p><b>Total:</b> ${total} seconds</p>
  `;

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
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Resend Gmail relay running on port ${PORT}`));
