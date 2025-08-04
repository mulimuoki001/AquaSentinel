import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardOverview } from '../features/farmer/components/mainComponents/DashboardOverview/dashboardOverview';
import { MemoryRouter } from 'react-router-dom';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

const mockSetLang = vi.fn();

vi.mock('../features/context/useGlobalContext', () => ({
    __esModule: true,
    default: () => ({
        currentLang: 'en',
        setLang: mockSetLang,
        waterFlowRateBuckets: [],
        waterUsageToday: [],
        moisture: {},
        waterFlow: {},
        unreadNotifications: [],
    }),
}));

describe('Dashboard Language Switch', () => {
    it('calls setLang when changing language', () => {
        render(
            <MemoryRouter>
                <DashboardOverview sidebarOpen={false} handleLogout={() => { }} />
            </MemoryRouter>
        );

        const select = screen.getByDisplayValue('English');
        fireEvent.change(select, { target: { value: 'rw' } });
        expect(mockSetLang).toHaveBeenCalledWith('rw');
    });
});
