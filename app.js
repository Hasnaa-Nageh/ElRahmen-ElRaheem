const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
// const adminRoute = require("./routes/admin.routes");
const doctorRoute = require("./routes/doctor.routes");
const medicalRoute = require("./routes/MedicalRecord.route");
const patientRoute = require("./routes/patient.route");
const receptionRoute = require("./routes/reception.route");
const appointmentRouter = require("./routes/appointment.route");
const analysisRoute = require("./routes/analysis.routes");
const departmentRoute = require("./routes/department.routes");

const labRouter = require("./routes/lab.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/auth", authRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/medical", medicalRoute);
app.use("/api/patient", patientRoute);
app.use("/api/reception", receptionRoute);
app.use("/api/appointment", appointmentRouter);
app.use("/api/docAnalysis", analysisRoute);
app.use("/api/lab", labRouter);
app.use("/api/analysis", analysisRoute);
app.use("/api/departments", departmentRoute);
module.exports = app;
