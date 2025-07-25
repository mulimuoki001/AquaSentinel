import { openDB } from 'idb';

export interface SensorData {
    id: string;
    timestamp: string;
    moisture: number;
    flowRate: number;
    zoneId: string;
}

export interface IrrigationSession {
    sessionId: string;
    userId: string;
    startTime: string;
    endTime: string | null;
    totalLiters: number;
    status: string;
}

const dbPromise = openDB('AquaSentinelDB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('sensorData')) {
            db.createObjectStore('sensorData', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('irrigationSessions')) {
            db.createObjectStore('irrigationSessions', { keyPath: 'sessionId' });
        }
    },
});

export const saveToStore = async <T>(
    storeName: 'sensorData' | 'irrigationSessions',
    data: T
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.put(data);
    await tx.done;
};

export const getAllFromStore = async <T>(
    storeName: 'sensorData' | 'irrigationSessions'
): Promise<T[]> => {
    const db = await dbPromise;
    return db.getAll(storeName);
};

export const clearStore = async (
    storeName: 'sensorData' | 'irrigationSessions'
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
};
