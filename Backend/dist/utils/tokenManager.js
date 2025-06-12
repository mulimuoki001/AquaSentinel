"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadActiveTokens = loadActiveTokens;
exports.removeActiveTokens = removeActiveTokens;
exports.saveActiveTokens = saveActiveTokens;
exports.getActiveToken = getActiveToken;
exports.setActiveToken = setActiveToken;
exports.removeActiveToken = removeActiveToken;
const fs_1 = __importDefault(require("fs"));
const file = "activeTokens.json";
function loadActiveTokens() {
    if (!fs_1.default.existsSync(file))
        fs_1.default.writeFileSync(file, "{}");
    const data = fs_1.default.readFileSync(file, "utf8").trim();
    return data ? JSON.parse(data) : {};
}
function removeActiveTokens() {
    fs_1.default.writeFileSync(file, "{}");
}
function saveActiveTokens(tokens) {
    fs_1.default.writeFileSync(file, JSON.stringify(tokens, null, 2));
}
function getActiveToken(userId) {
    return loadActiveTokens()[userId];
}
function setActiveToken(userId, token) {
    const tokens = loadActiveTokens();
    tokens[userId] = token;
    saveActiveTokens(tokens);
}
function removeActiveToken(userId) {
    const tokens = loadActiveTokens();
    delete tokens[userId];
    saveActiveTokens(tokens);
}
