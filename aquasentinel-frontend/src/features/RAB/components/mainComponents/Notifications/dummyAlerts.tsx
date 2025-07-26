interface PolicyAlert {
    id: number;
    region: string;
    category: string;
    description: string;
    severity: "Info" | "Warning" | "Critical";
    timestamp: string;
    status: "Ongoing" | "Resolved";
}

export const policyAlerts: PolicyAlert[] = [
    {
        id: 1,
        region: "Nyagatare",
        category: "Efficiency Drop",
        description: "Irrigation efficiency in Nyagatare dropped below 55% for 3 consecutive days.",
        severity: "Warning",
        status: "Ongoing",
        timestamp: "2025-07-23T07:45:00Z"
    },
    {
        id: 2,
        region: "Bugesera",
        category: "Overuse",
        description: "Water usage in Bugesera exceeded weekly quotas by 42%.",
        severity: "Critical",
        status: "Ongoing",
        timestamp: "2025-07-23T04:10:00Z"
    },
    {
        id: 3,
        region: "Gatsibo",
        category: "Irrigation Gap",
        description: "40% of SSIT farms in Gatsibo did not irrigate in the last 5 days.",
        severity: "Critical",
        status: "Ongoing",
        timestamp: "2025-07-22T17:30:00Z"
    },
    {
        id: 4,
        region: "Nyamagabe",
        category: "System Recovery",
        description: "Previously offline farms in Nyamagabe are now fully online.",
        severity: "Info",
        status: "Resolved",
        timestamp: "2025-07-22T12:00:00Z"
    },
    {
        id: 5,
        region: "Kirehe",
        category: "Reporting Gap",
        description: "No sensor data received from any provider in Kirehe for 48 hours.",
        severity: "Warning",
        status: "Ongoing",
        timestamp: "2025-07-21T09:20:00Z"
    }
];