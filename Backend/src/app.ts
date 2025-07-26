import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import moistureRoutes from "./routes/sensor.routes";
import AIrouter from "./controllers/rabAI.controller";
const app = express();
const __rootdir = path.resolve(); // root of your entire project
dotenv.config();

// Middleware
app.use(cors({
    origin: "*", // or your frontend domain
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}));

app.use(express.json());

//Serving static files
app.use(express.static(path.join(__dirname, "../public")));


// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard/role", dashboardRoutes);
app.use("/api/sensors", moistureRoutes);
app.use("/api/ai", AIrouter);

app.use('/uploads', express.static(path.join(__rootdir, 'uploads')));
console.log("Serving /uploads from:", path.join(__dirname, "..", "uploads"));

// //React router fallback
app.get("{/*any}", (req, res, next) => {
    if (
        req.method === "GET" &&
        !req.url.startsWith("/api") &&
        !req.url.startsWith("/auth") &&
        !req.url.startsWith("/users") &&
        !req.url.startsWith("/uploads") &&
        !req.url.includes(".")
    ) {
        res.sendFile(path.join(__dirname, "../public", "index.html"));
    } else {
        next();
    }
});


export default app;
