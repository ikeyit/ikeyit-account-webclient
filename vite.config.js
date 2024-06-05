import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 6111,
        open: true,
        proxy: {
//            '/api': {
//                target: 'http://localhost:8920/',
//            },
//            '/oauth2': {
//                target: 'http://localhost:8920/',
//            },
//            '/login': {
//                target: 'http://localhost:8920/',
//            },
//            '/logout': {
//                target: 'http://localhost:8920/',
//            },
        },
    }
})
