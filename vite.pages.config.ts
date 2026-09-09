import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/a129-kirie/",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  define: {
    "import.meta.env.VITE_SPA": JSON.stringify("1"),
    "import.meta.env.VITE_AUTH_ENABLED": JSON.stringify("false"),
  },
});
