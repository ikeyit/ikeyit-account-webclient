import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import fs from 'fs'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), "");
    const certPath = env.HTTPS_CERT ? path.resolve(process.cwd(), env.HTTPS_CERT) : null;
    const keyPath = env.HTTPS_KEY ? path.resolve(process.cwd(), env.HTTPS_KEY) : null;
    let https = null;
    if (certPath && keyPath && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        https = {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
        };
        console.log('[Vite] 使用 HTTPS 模式');
    } else {
        console.log('[Vite] 未找到有效证书，使用 HTTP 模式');
    }

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 6111,
            open: false,
            https,
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            proxyReq.setHeader('X-Forwarded-Proto', 'https')
                            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '')
                            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress || '')
                        })
                    },
                },
                '/auth': {
                    target: 'http://localhost:8080',
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            proxyReq.setHeader('X-Forwarded-Proto', 'https')
                            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '')
                            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress || '')
                        })
                    },
                },
                '/oauth2': {
                    target: 'http://localhost:8080',
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            proxyReq.setHeader('X-Forwarded-Proto', 'https')
                            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '')
                            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress || '')
                        })
                    },
                },
                '/connect': {
                    target: 'http://localhost:8080',
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            proxyReq.setHeader('X-Forwarded-Proto', 'https')
                            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '')
                            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress || '')
                        })
                    },
                },
                '/.well-known': {
                    target: 'http://localhost:8080',
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            proxyReq.setHeader('X-Forwarded-Proto', 'https')
                            proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '')
                            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress || '')
                        })
                    },
                }
            },
        },
    }
})
