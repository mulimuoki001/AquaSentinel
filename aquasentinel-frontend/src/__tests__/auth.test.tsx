/// <reference types="vitest" />
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import * as registerService from '../features/authentication/authServices/Register';
import RegisterPage from '../features/authentication/pages/Register';
import * as loginService from '../features/authentication/authServices/Login';
import Login from '../features/authentication/pages/Login';
import { BrowserRouter } from 'react-router-dom';
import logoutService from '../features/authentication/authServices/Logout';
import LogoutPage from '../features/authentication/pages/Logout';

// ✅ Mock navigation BEFORE importing BrowserRouter
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
//Mock registerUser BEFORE importing it in tests
vi.mock('../features/authentication/authServices/Register', () => ({
    registerUser: vi.fn(),
}))
// Mock loginUser BEFORE importing it in tests
vi.mock('../features/authentication/authServices/Login', () => ({
    loginUser: vi.fn(),
}));


// Mock logoutService
vi.mock('../features/authentication/authServices/Logout', () => ({
    default: {
        logout: vi.fn(),
    },
}));



describe('Register Page', () => {
    it('registers a new farmer and navigates to success page', async () => {
        const mockRegister = registerService.registerUser as ReturnType<typeof vi.fn>;
        mockRegister.mockResolvedValue({ message: 'User registered successfully' });

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), {
            target: { value: 'Brian Muli' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter your email address/i), {
            target: { value: 'brian@example.com' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
            target: { value: 'Test@123' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter your farm name/i), {
            target: { value: 'Muli Farm' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter your farm location/i), {
            target: { value: 'Kayonza' },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter your farm phone number/i), {
            target: { value: '+250791704016' },
        });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(
                'Brian Muli',
                'brian@example.com',
                'Test@123',
                'farmer',
                'Muli Farm',
                'Kayonza',
                '+250791704016'
            );
            expect(mockNavigate).toHaveBeenCalledWith('/registration-success');
        });
    });
});
describe('Login Page', () => {
    it('logs in successfully and navigates to dashboard', async () => {
        // Mock API success response
        (loginService.loginUser as ReturnType<typeof vi.fn>).mockResolvedValue({
            newToken: 'mock-token',
            role: 'farmer',
            userId: 1,
        });

        // Render the component
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );


        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
            target: { value: 'user@example.com' },
        });

        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'Test@123' },
        });

        // Click submit
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for effects
        await waitFor(() => {
            expect(loginService.loginUser).toHaveBeenCalledWith('user@example.com', 'Test@123');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard/farmer');
        });
    });
});


describe('Logout Page', () => {
    it('logs out and navigates to login', async () => {
        const mockLogout = logoutService.logout as ReturnType<typeof vi.fn>;
        mockLogout.mockResolvedValue(undefined);

        render(
            <BrowserRouter>
                <LogoutPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /logout/i }));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});