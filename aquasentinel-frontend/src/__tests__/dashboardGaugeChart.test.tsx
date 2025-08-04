import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from '../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import { MemoryRouter } from 'react-router-dom';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

vi.mock('../features/context/useGlobalContext', () => ({
    __esModule: true,
    default: () => ({
        waterFlow: { pumpStatus: 'ON', waterFlow: 15, flowUnit: 'L/min' },
        waterFlowRateBuckets: [
            { time_label: '08:00', avg_flow_rate: 5 },
            { time_label: '09:00', avg_flow_rate: 10 },
        ],
        waterUsageToday: [
            { time_label: '08:00', liters_used: 12 },
            { time_label: '09:00', liters_used: 18 },
        ],
        unreadNotifications: [],
        moisture: {},
    }),
}));

describe('Dashboard Gauges and Charts', () => {
    const renderDashboard = () =>
        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

    it('renders Pump Rate gauge value', () => {
        renderDashboard();
        expect(screen.getByText(/L\/min/i)).toBeInTheDocument();
    });

    it('renders Flow Rate chart', () => {
        renderDashboard();
        expect(screen.getByText(/dashboard\.flowRate/i)).toBeInTheDocument();
    });

});
