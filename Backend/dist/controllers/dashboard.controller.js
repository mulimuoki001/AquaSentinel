"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABDashboard = exports.providerDashboard = exports.farmerDashboard = void 0;
const farmerDashboard = async (req, res) => {
    const farmerData = req.userData;
    res.send(farmerData);
};
exports.farmerDashboard = farmerDashboard;
const providerDashboard = async (req, res) => {
    const userData = req.userData;
    res.send(userData);
};
exports.providerDashboard = providerDashboard;
const RABDashboard = async (req, res) => {
    const userData = req.user;
    console.log(req.user);
    console.log("userData:", userData);
    res.send(userData);
};
exports.RABDashboard = RABDashboard;
