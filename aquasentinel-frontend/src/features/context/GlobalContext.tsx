// GlobalContext.ts
import { createContext } from 'react';
import type { MoistureData, WaterFlowData, WaterFlowRateBucket, Notification, UserData, WaterUsageTodayBuckets } from "../types/types";
interface GlobalContextType {
    // define the properties of the GlobalContextType here
    moisture: MoistureData | null;
    waterFlow: WaterFlowData | null;
    waterUsed: number | null;
    pumpRuntime: number | null;
    waterFlowRateBuckets: WaterFlowRateBucket[];
    waterUsageToday: WaterUsageTodayBuckets[];
    notifications: Notification[];
    unreadNotifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    error: string | null;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export default GlobalContext;