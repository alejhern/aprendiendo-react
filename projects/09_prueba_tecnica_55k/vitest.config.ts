import react from "@vitejs/plugin-react-swc";
//<reference types="vitest" />
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "happy-dom",
		setupFiles: "./vitest.setup.ts",
		globals: true,
	},
});
