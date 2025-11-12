import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ Your EmailJS credentials
const SERVICE_ID = "service_gq8aexf";
const TEMPLATE_ID = "template_fl6jrta";
const PRIVATE_KEY = "Ih-q0LCJBs-O0ENmwDM0s"; // private key from EmailJS

// ✅ Root route for status check
app.get("/", (req, res) => {
  res.send("✅ MotorControl Email Relay Server is running and ready to send emails.");
});

// ✅ API route for ESP32
app.post("/send-report", async (req, res) => {
  const { name, email, date, time, forward, backward, total } = req.body;

  if (!name || !email) {
    return res.status(400).send("Missing required fields");
  }

  console.log("📨 Email request received from ESP32:", req.body);

  try {
    // ✅ Correct endpoint for both public or private key
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        accessToken: PRIVATE_KEY, // 👈 correct field for private key
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

// ✅ Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
