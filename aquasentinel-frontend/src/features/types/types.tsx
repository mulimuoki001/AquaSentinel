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
export interface WaterUsageTodayBuckets {
    bucket_start: string;
    time_label: string;
    liters_used: number
}

export interface WaterFlowRateBucket {
    avg_flow_rate: number;
    bucket_start: string;
    time_label: string;

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
export interface UserData {
    id: number;
    name: string;
    role: string;
    email: string;
    farmname: string;
    farmlocation: string;
    farmphone: string;
    profile_pic: string | null;
}