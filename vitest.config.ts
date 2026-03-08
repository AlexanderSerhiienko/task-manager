import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@/auth": path.resolve(rootDir, "src/auth.ts"),
      "@/lib": path.resolve(rootDir, "src/lib"),
      "@/server": path.resolve(rootDir, "src/server"),
      "@/shared": path.resolve(rootDir, "src/shared"),
      "@/hooks": path.resolve(rootDir, "src/hooks"),
      "@/components": path.resolve(rootDir, "components"),
      "@/app": path.resolve(rootDir, "app"),
      "@/tests": path.resolve(rootDir, "tests"),
      "@": path.resolve(rootDir),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["tests/setup/node.setup.ts", "tests/setup/ui.setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    clearMocks: true,
    restoreMocks: true,
  },
});
