import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../../features/authentication/pages/Login';

// Mock loginUser so no real network requests are made
const mockLoginUser = vi.fn();
vi.mock('../../features/authentication/authServices/Login', () => ({
    loginUser: (...args: any[]) => mockLoginUser(...args),
}));

// Mock token validation to skip the auto-redirect on mount
vi.mock('../../features/authentication/authServices/tokenValidation', () => ({
    validateToken: () => Promise.resolve({ valid: false, role: null }),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual as object, useNavigate: () => mockNavigate };
});

describe('Role-Based Navigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const loginAndCheckRedirect = async (role: string) => {
        mockLoginUser.mockResolvedValue({
            newToken: 'fakeToken',
            role,
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
            target: { value: `${role}@example.com` },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'Test@123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(`/dashboard/${role}`);
        });
    };

    it('navigates Farmer to farmer dashboard', async () => {
        await loginAndCheckRedirect('farmer');
    });

    it('navigates Provider to provider dashboard', async () => {
        await loginAndCheckRedirect('provider');
    });

    it('navigates RAB to RAB dashboard', async () => {
        await loginAndCheckRedirect('RAB');
    });
});
