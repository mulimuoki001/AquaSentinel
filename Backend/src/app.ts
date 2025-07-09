import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
// import authRoutes from "./routes/auth.routes";
// import dashboardRoutes from "./routes/dashboard.routes";
// import userRoutes from "./routes/user.routes";
// import moistureRoutes from "./routes/sensor.routes";

const app = express();
const __rootdir = path.resolve(); // root of your entire project
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

//Serving static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/dashboard", dashboardRoutes);
// app.use("/api/sensors", moistureRoutes);


app.use('/uploads', express.static(path.join(__rootdir, 'uploads')));
console.log("Serving /uploads from:", path.join(__dirname, "..", "uploads"));

// //React router fallback
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

export default app;
