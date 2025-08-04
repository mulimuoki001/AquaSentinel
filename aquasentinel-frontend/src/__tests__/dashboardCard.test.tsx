import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from '../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import { MemoryRouter } from 'react-router-dom';

// Patch ResizeObserver for Vitest
beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

// Mock context values for cards
vi.mock('../features/context/useGlobalContext', () => ({
    __esModule: true,
    default: () => ({
        moisture: { moisture: 45, moistureUnit: '%' },
        waterFlow: { pumpStatus: 'ON', waterFlow: 15, flowUnit: 'L/min' },
        waterUsed: 120,
        pumpRuntime: 40,
        waterFlowRateBuckets: [],
        waterUsageToday: [],
        unreadNotifications: [],
        currentLang: 'en',
        setLang: vi.fn(),
    }),
}));

describe('Dashboard Cards', () => {
    const renderDashboard = () =>
        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

    it('renders Total Water Used', () => {
        renderDashboard();
        expect(screen.getByText(/dashboard\.totalWaterUsed/i)).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
    });

    it('renders Current Soil Moisture', () => {
        renderDashboard();
        expect(screen.getByText(/dashboard\.currentSoilMoisture/i)).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('renders Pump Runtime', () => {
        renderDashboard();
        expect(screen.getByText(/dashboard\.pumpRuntime/i)).toBeInTheDocument();
        expect(screen.getByText('40 mins')).toBeInTheDocument();
    });
});
