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
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Routes
app.use("/auth", auth_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/dashboard", dashboard_routes_1.default);
// //React router fallback
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });
exports.default = app;
