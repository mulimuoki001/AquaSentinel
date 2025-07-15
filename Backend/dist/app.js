"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const sensor_routes_1 = __importDefault(require("./routes/sensor.routes"));
const app = (0, express_1.default)();
const __rootdir = path_1.default.resolve(); // root of your entire project
dotenv_1.default.config();
// Middleware
app.use((0, cors_1.default)({
    origin: "*", // or your frontend domain
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}));
app.use(express_1.default.json());
//Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Routes
app.use("/auth", auth_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/dashboard/role", dashboard_routes_1.default);
app.use("/api/sensors", sensor_routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__rootdir, 'uploads')));
console.log("Serving /uploads from:", path_1.default.join(__dirname, "..", "uploads"));
// //React router fallback
app.get("{/*any}", (req, res, next) => {
    if (req.method === "GET" &&
        !req.url.startsWith("/api") &&
        !req.url.startsWith("/auth") &&
        !req.url.startsWith("/users") &&
        !req.url.startsWith("/uploads") &&
        !req.url.includes(".")) {
        res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
    }
    else {
        next();
    }
});
exports.default = app;
