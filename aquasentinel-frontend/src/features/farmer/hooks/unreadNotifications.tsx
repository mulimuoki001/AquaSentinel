// hooks/useUnreadNotifications.ts
import { useEffect, useState } from "react";

export interface Notification {
    id: string;
    title: string;
    read: boolean;
    createdAt: string;
    time: string;
}

export default function useUnreadNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("pump_notifications");
        if (saved) {
            const allNotifications: Notification[] = JSON.parse(saved);
            const unread = allNotifications.filter(n => !n.read);
            setUnreadNotifications(unread);
        }
    }, []);

    return unreadNotifications;
}
