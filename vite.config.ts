import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

/** @type {import('vite').UserConfig} */
export default {
    plugins: [react(), dts({ rollupTypes: true })],
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "react-dynamic-form"
        },
        rollupOptions: {
            external: ["react", "react-dom"],
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
    },
};
