import react from "@vitejs/plugin-react-swc";
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} */
export default {
    plugins: [react(), dts({rollupTypes: true})],
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "react-dynamic-form",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
        },
    },
}
