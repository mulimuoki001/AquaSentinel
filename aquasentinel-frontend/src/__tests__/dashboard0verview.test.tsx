// dashboardOverview.test.tsx

beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from '../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import * as GlobalContextModule from '../features/context/GlobalAppContext';
import { MemoryRouter } from 'react-router-dom';
vi.mock('../context/GlobalAppContext');

// Mock context return
vi.spyOn(GlobalContextModule, 'useGlobalContext').mockReturnValue({
    moisture: { moisture: 45, moistureUnit: '%', moistureChange: 0 },
    waterFlow: { pumpStatus: 'ON', waterFlow: 15, flowUnit: 'L/min', timestamp: new Date(), date: "2023-07-15", time: "00:00" },
    waterUsed: 120,
    pumpRuntime: 40,
    waterFlowRateBuckets: [],
    waterUsageToday: [],
    notifications: [],
    unreadNotifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    userData: { id: 1, profile_pic: '', name: '', email: '', role: '', farmname: '', farmlocation: '', farmphone: '' },
    setUserData: vi.fn(),
    setNotifications: vi.fn(),
});

describe('DashboardOverview Component', () => {
    it('renders sensor data and alerts correctly', () => {
        // const mockLogout = vi.fn();

        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        // Check values
        expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument(); // moisture
        expect(screen.getByText('120')).toBeInTheDocument(); // water used
        expect(screen.getByText('40 mins')).toBeInTheDocument(); // runtime
        expect(screen.getByText(/No new alerts/)).toBeInTheDocument(); // alerts
    });
});
