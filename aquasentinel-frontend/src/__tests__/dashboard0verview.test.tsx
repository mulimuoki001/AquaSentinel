import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from '../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import { MemoryRouter } from 'react-router-dom';

// ✅ Patch ResizeObserver for test env (Vitest doesn't have it)
beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

// ✅ Mock the `useGlobalContext` hook
vi.mock('../features/context/useGlobalContext', () => {
    return {
        __esModule: true,
        default: () => ({
            moisture: { moisture: 45, moistureUnit: '%', moistureChange: 0 },
            waterFlow: {
                pumpStatus: 'ON',
                waterFlow: 15,
                flowUnit: 'L/min',
                timestamp: new Date(),
                date: "2023-07-15",
                time: "00:00"
            },
            waterUsed: 120,
            pumpRuntime: 40,
            waterFlowRateBuckets: [],
            waterUsageToday: [],
            notifications: [],
            unreadNotifications: [],
            unreadCount: 0,
            isLoading: false,
            error: null,
            userData: null,
            setUserData: vi.fn(),
            setNotifications: vi.fn(),
        }),
    };
});

describe('DashboardOverview Component', () => {
    it('renders sensor data and alerts correctly', () => {
        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        expect(screen.getByText(/dashboard\.overview/i)).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument(); // moisture
        expect(screen.getByText('120')).toBeInTheDocument(); // water used
        expect(screen.getByText('40 mins')).toBeInTheDocument(); // runtime
        expect(screen.getByText(/dashboard\.noNewAlerts/i)).toBeInTheDocument(); // alerts
    });
});
