import { vi } from 'vitest';
import '@testing-library/jest-dom';


// ✅ Mock react-i18next so it doesn't need a real i18n instance
vi.mock('react-i18next', async () => ({
    ...(await vi.importActual('react-i18next')),
    useTranslation: () => ({
        t: (key: string) => key, // just return the key
        i18n: { changeLanguage: vi.fn() },
    }),
}));

// ✅ Mock Recharts ResponsiveContainer so it has width/height in tests
vi.mock('recharts', async () => {
    const original = await vi.importActual<any>('recharts');
    return {
        ...original,
        ResponsiveContainer: ({ children }: any) => (
            <div style={{ width: 800, height: 400 }}>{children}</div>
        ),
    };
});

// ✅ Fix ResizeObserver in jsdom
global.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
