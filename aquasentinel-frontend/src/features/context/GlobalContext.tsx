// GlobalContext.ts
import { createContext } from 'react';
import type { MoistureData, WaterFlowData, WaterFlowRateBucket, Notification, UserData, WaterUsageTodayBuckets } from "../types/types";
import i18n from "../../../i18n/i18n";
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
    i18n: typeof i18n;
    currentLang: string;
    setLang: (lang: string) => void;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    error: string | null;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export default GlobalContext;