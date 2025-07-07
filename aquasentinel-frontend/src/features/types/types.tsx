// types.ts
export interface MoistureData {
    moisture: number;
    moistureUnit: string;
    moistureChange: number;
}
export interface Notification {
    id: string;
    title: string;
    read: boolean;
    createdAt: string;
    time: string;
}

export interface WaterFlowData {
    waterFlow: number;
    flowUnit: string;
    pumpStatus: string;
    timestamp: Date;
    date: string;
    time: string;
}

export interface WaterUsageBucket {
    bucket_start: string;
    liters_used: number;
}
export interface PumpSession {
    id: number;
    user_id: number;
    date: string;
    start_time: string;
    end_time: string | null;
    duration: number;
    total_liters: number;
    status: string;
}
