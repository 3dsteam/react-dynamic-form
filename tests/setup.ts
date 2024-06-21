import "@testing-library/jest-dom/vitest";

// Mock window.computeStyle
window.getComputedStyle = vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue("auto"),
}));
