import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Build the bookmarklet payload as a single self-executing IIFE.
// CSS is inlined as JS strings via `?inline` imports — no separate .css file.
// Output lands in dist/ alongside the SPA build (emptyOutDir: false).

export default defineConfig({
  plugins: [react()],
  define: {
    // React reads this at runtime; Vite doesn't auto-replace in library mode.
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/embed.tsx"),
      name: "UIBuilder",
      formats: ["iife"],
      fileName: () => "embed.js",
    },
    rollupOptions: {
      output: {
        // Single self-contained file
        inlineDynamicImports: true,
      },
    },
  },
});
