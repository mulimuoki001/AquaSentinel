import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DashboardOverview } from '../../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import { SmartRecommendations } from '../../features/farmer/components/mainComponents/SmartRecommendations/smartRecommendations';

// ✅ Base mock for all tests
const mockSetLang = vi.fn();
let mockContext = {
    currentLang: 'en',
    setLang: mockSetLang,
    waterUsed: 120,
    moisture: { moisture: 45, moistureUnit: '%' },
    pumpRuntime: 40,
    waterFlow: { pumpStatus: 'ON', waterFlow: 15, flowUnit: 'L/min' },
    unreadNotifications: [],
    waterFlowRateBuckets: [],
    waterUsageToday: [],
    userData: { id: 1, role: 'farmer' },
};

// ✅ Apply context mock once
vi.mock('../../features/context/useGlobalContext', () => ({
    __esModule: true,
    default: () => mockContext,
}));

// ✅ Mock fetch globally so it is ready before imports
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
) as any;

beforeEach(() => {
    // reset context before each test
    mockContext = {
        ...mockContext,
        moisture: { moisture: 45, moistureUnit: '%' },
    };
    vi.clearAllMocks();
});

describe('Frontend Functional Tests', () => {
    // 1️⃣ Language Switching
    it('changes language when dropdown is selected', () => {
        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        const langSelect = screen.getByDisplayValue('English');
        fireEvent.change(langSelect, { target: { value: 'rw' } });
        expect(mockSetLang).toHaveBeenCalledWith('rw');
    });

    // 2️⃣ AI-driven Irrigation Suggestions
    it('shows irrigation advice when moisture is low', async () => {
        mockContext = {
            ...mockContext,
            moisture: { moisture: 20, moistureUnit: '%' },
        };

        render(
            <MemoryRouter>
                <SmartRecommendations sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        // Wait for async useEffect to run without act() warning
        await waitFor(() => {
            const matches = screen.getAllByText(/recommend/i);
            expect(matches.length).toBeGreaterThan(0);
        });
    });

    // 3️⃣ Performance / Load Time
    it('loads dashboard under 2 seconds', () => {
        const start = performance.now();

        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        const end = performance.now();
        expect(end - start).toBeLessThan(2000);
    });
});
