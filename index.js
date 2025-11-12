import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ Your EmailJS details
const SERVICE_ID = "service_gq8aexf";
const TEMPLATE_ID = "template_fl6jrta";
const PRIVATE_KEY = "Ih-q0LCJBs-O0ENmwDM0s"; // from https://dashboard.emailjs.com/admin/account

// ✅ Root test route (for browser)
app.get("/", (req, res) => {
  res.send("✅ MotorControl Email Relay Server is running.");
});

// ✅ API route for ESP32 to send reports
app.post("/send-report", async (req, res) => {
  const { name, email, date, time, forward, backward, total } = req.body;

  if (!name || !email) {
    return res.status(400).send("Missing required fields");
  }

  console.log("📨 Email request received from ESP32:");
  console.log(req.body);

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        accessToken: PRIVATE_KEY,
        template_params: {
          name,
          email,
          date,
          time,
          forward,
          backward,
          total,
        },
      }),
    });

    const text = await response.text();
    console.log("✅ EmailJS Response:", response.status, text);
    res.status(response.status).send(text);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).send("Server error");
  }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
