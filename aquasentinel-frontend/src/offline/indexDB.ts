import { openDB } from 'idb';

export interface SensorData {
    id: string;
    timestamp: string;
    moisture: number;
    flowRate: number;
    zoneId: string;
    synced?: boolean;
}

export interface IrrigationSession {
    sessionId: string;
    userId: string;
    startTime: string;
    endTime: string | null;
    totalLiters: number;
    status: string;
    synced?: boolean;
}

type StoreName = 'sensorData' | 'irrigationSessions';

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

// Save a record (default synced: false)
export const saveToStore = async <T extends { synced?: boolean }>(
    storeName: StoreName,
    data: T
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.put({ ...data, synced: false });
    await tx.done;
};

// Get all records
export const getAllFromStore = async <T>(storeName: StoreName): Promise<T[]> => {
    const db = await dbPromise;
    return db.getAll(storeName);
};

// Get only unsynced records
export const getUnsyncedFromStore = async <T extends { synced?: boolean }>(
    storeName: StoreName
): Promise<T[]> => {
    const db = await dbPromise;
    const all = await db.getAll(storeName);
    return all.filter((item) => !item.synced);
};

// Mark records as synced (based on key)
export const markAsSynced = async (
    storeName: StoreName,
    key: string
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.store;
    const item = await store.get(key);

    if (item) {
        item.synced = true;
        await store.put(item);
    }

    await tx.done;
};

// Optional: Clear all synced records
export const clearSyncedRecords = async (storeName: StoreName): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.store;
    const all = await store.getAll();

    for (const item of all) {
        if (item.synced) {
            await store.delete(storeName === 'sensorData' ? item.id : item.sessionId);
        }
    }

    await tx.done;
};

// Clear entire store
export const clearStore = async (storeName: StoreName): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
};
