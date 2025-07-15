"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadActiveTokens = loadActiveTokens;
exports.saveActiveTokens = saveActiveTokens;
exports.removeActiveTokens = removeActiveTokens;
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
function saveActiveTokens(tokens) {
    fs_1.default.writeFileSync(file, JSON.stringify(tokens, null, 2));
}
function removeActiveTokens() {
    fs_1.default.writeFileSync(file, "{}");
}
function getActiveToken(userId) {
    const tokens = loadActiveTokens();
    return tokens[userId]?.token;
}
function setActiveToken(userId, token, expirationTime) {
    const tokens = loadActiveTokens();
    tokens[userId] = { token, expirationTime };
    saveActiveTokens(tokens);
}
function removeActiveToken(token) {
    const tokens = loadActiveTokens();
    const key = Object.keys(tokens).find((key) => tokens[key].token === token);
    if (key) {
        delete tokens[key];
        saveActiveTokens(tokens);
    }
    else {
        console.log("Token not found");
    }
}
