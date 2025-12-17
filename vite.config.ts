import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  server: {
    allowedHosts: [
      "localhost",
    ],
    host: true, // opsional, agar bisa diakses dari luar
    strictPort: false, // opsional

    // TAMBAHKAN PROXY INI
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Backend local Anda
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Hapus header yang bermasalah
            proxyReq.removeHeader("ngrok-skip-browser-warning");
            proxyReq.removeHeader("origin");
          });
        },
      },
    },
  },
});
