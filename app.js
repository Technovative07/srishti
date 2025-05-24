import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnection from "./database/db.js";
import authRouter from "./routes/auth.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import patientRouter from "./routes/patient.routes.js";
import reportRouter from "./routes/report.routes.js"; // ✅ Use relative path
import appointMentRouter from "./routes/appointment.routes.js";
import auditRouter from "./routes/audit.routes.js";
import voiceRouter from "./routes/voice.route.js";




dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

const port = process.env.PORT || 5000;

// Connect to DB
dbconnection();

// Mount routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/report", reportRouter); // ✅ FIXED missing path
app.use("/api/v1/appointment", appointMentRouter);
app.use("api/v1/audit", auditRouter)
app.use("/api/v1/voice", voiceRouter);


// Serve static files (if needed, e.g., uploads)
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
