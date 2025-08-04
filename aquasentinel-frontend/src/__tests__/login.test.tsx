import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../features/authentication/pages/Login';

// Mocked services
const mockLoginUser = vi.fn();
const mockValidateToken = vi.fn(() => Promise.resolve({ valid: false, role: null }));
const mockNavigate = vi.fn();

vi.mock('../features/authentication/authServices/Login', () => ({
    loginUser: (...args: Parameters<typeof mockLoginUser>) => mockLoginUser(...args)
}));

vi.mock('../features/authentication/authServices/tokenValidation', () => ({
    validateToken: (...args: Parameters<typeof mockValidateToken>) => mockValidateToken(...args)
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as object,
        useNavigate: () => mockNavigate
    };
});

describe('Login Page Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows error if fields are empty', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Disable HTML5 validation in this test
        const form = screen.getByRole('form', { name: /login form/i }) as HTMLFormElement;
        form.noValidate = true;

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });

    it('logs in successfully and navigates to farmer dashboard', async () => {
        mockLoginUser.mockResolvedValue({
            newToken: 'fakeToken',
            role: 'farmer'
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
            target: { value: 'farmer@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'Test@123' }
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard/farmer');
        });
    });

    it('shows error on login failure', async () => {
        mockLoginUser.mockRejectedValue(new Error('Invalid credentials'));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
            target: { value: 'wrong@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrongpass' }
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });
});
