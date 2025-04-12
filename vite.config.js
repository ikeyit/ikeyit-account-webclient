import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 6111,
        open: false,
        allowedHosts: ["account.dev.local"],
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
            },
            '/auth': {
                target: 'http://localhost:8080',
            },
            '/oauth2': {
                target: 'http://localhost:8080',
            },
            '/connect': {
                target: 'http://localhost:8080',
            },
            '/.well-known': {
                target: 'http://localhost:8080',
            }
        },
    },
})
