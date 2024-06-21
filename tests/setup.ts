import "@testing-library/jest-dom/vitest";
import { setupIonicReact } from "@ionic/react";
import { afterEach } from "vitest";

// Setup Ionic React
setupIonicReact();

afterEach(() => {
    vi.clearAllMocks();
});

// Mock window.computeStyle
window.getComputedStyle = vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue("auto"),
}));
