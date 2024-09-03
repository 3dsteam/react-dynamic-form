import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => {
    vi.clearAllMocks();
});

// Mock window.computeStyle
window.getComputedStyle = vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue("auto"),
}));
