// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react()
//   ],
//   server: {
//     allowedHosts: [
//       "9096f13420f8.ngrok-free.app", // host ngrok kamu
//     ],
//     host: true,            // opsional, agar bisa diakses dari luar
//     strictPort: false,     // opsional
//   },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["localhost"],
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
