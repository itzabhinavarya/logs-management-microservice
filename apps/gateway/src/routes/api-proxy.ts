import { createProxyMiddleware } from 'http-proxy-middleware';

export const apiProxy = createProxyMiddleware({
    pathFilter: '/api',
    target: 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
});