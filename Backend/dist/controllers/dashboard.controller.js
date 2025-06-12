"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABDashboard = exports.providerDashboard = exports.farmerDashboard = void 0;
const farmerDashboard = async (req, res) => {
    res.send("Farmer Dashboard");
};
exports.farmerDashboard = farmerDashboard;
const providerDashboard = async (req, res) => {
    res.send("Provider Dashboard");
};
exports.providerDashboard = providerDashboard;
const RABDashboard = async (req, res) => {
    res.send("RAB Dashboard");
};
exports.RABDashboard = RABDashboard;
