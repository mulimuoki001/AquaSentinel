import { openDB } from 'idb';
import type {
    MoistureData,
    WaterFlowData,
    WaterUsageTodayBuckets,
    WaterFlowRateBucket,
    PumpSession,
    UserData
} from '../features/types/types';

// ✅ IndexedDB-friendly types (no Date objects)
export interface IndexedWaterFlowData extends Omit<WaterFlowData, 'timestamp'> {
    timestamp: string;
}

type StoreNames =
    | 'moistureData'
    | 'waterFlowData'
    | 'waterUsageToday'
    | 'flowRateBuckets'
    | 'pumpSessions'
    | 'userData';

type DBTypes = {
    moistureData: MoistureData;
    waterFlowData: IndexedWaterFlowData;
    waterUsageToday: WaterUsageTodayBuckets;
    flowRateBuckets: WaterFlowRateBucket;
    pumpSessions: PumpSession;
    userData: UserData;
};

const DB_NAME = 'AquaSentinelDB';
const DB_VERSION = 1;

const dbPromise = openDB<DBTypes>(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('moistureData')) {
            db.createObjectStore('moistureData', { keyPath: 'moistureUnit' }); // override key as needed
        }
        if (!db.objectStoreNames.contains('waterFlowData')) {
            db.createObjectStore('waterFlowData', { keyPath: 'timestamp' });
        }
        if (!db.objectStoreNames.contains('waterUsageToday')) {
            db.createObjectStore('waterUsageToday', { keyPath: 'bucket_start' });
        }
        if (!db.objectStoreNames.contains('flowRateBuckets')) {
            db.createObjectStore('flowRateBuckets', { keyPath: 'bucket_start' });
        }
        if (!db.objectStoreNames.contains('pumpSessions')) {
            db.createObjectStore('pumpSessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('userData')) {
            db.createObjectStore('userData', { keyPath: 'id' });
        }
    }
});

export const saveToStore = async <K extends StoreNames>(
    storeName: K,
    data: DBTypes[K]
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.put(data);
    await tx.done;
};

export const getAllFromStore = async <K extends StoreNames>(
    storeName: K
): Promise<DBTypes[K][]> => {
    const db = await dbPromise;
    return await db.getAll(storeName);
};

export const clearStore = async <K extends StoreNames>(
    storeName: K
): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
};
