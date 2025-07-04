let _latestPumpSession: any = null;

export function setLatestPumpSession(session: any) {
    _latestPumpSession = session;
}

export function getLatestPumpSession() {
    return _latestPumpSession;
}
