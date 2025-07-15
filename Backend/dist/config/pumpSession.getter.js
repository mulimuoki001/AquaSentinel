"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLatestPumpSession = setLatestPumpSession;
exports.getLatestPumpSession = getLatestPumpSession;
let _latestPumpSession = null;
function setLatestPumpSession(session) {
    _latestPumpSession = session;
}
function getLatestPumpSession() {
    return _latestPumpSession;
}
