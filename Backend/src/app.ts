import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

//Serving static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);

// //React router fallback
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

export default app;
