import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "../middlewares/auth.js";
import { logger } from "./logger.js";

/**
 * Helper function to create a proxy middleware with common configurations.
 * @param target - The target service URL.
 * @param pathRewrite - Path rewrite rules.
 * @param requiresAuth - Whether the route requires authentication.
 * @returns Configured proxy middleware.
 */
export const createServiceProxy = (target: any, pathRewrite: any, requiresAuth = false) => {
    const middleware = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        onProxyReq: (proxyReq: any, req: Request, _res: Response) => {
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err: { message: any; }, _req: any, _res: any) => {
            logger.error('Proxy error:', err.message);
            _res.status(502).json({ error: 'Proxy error', details: err.message });
        },
    } as any);

    return requiresAuth
        ? [verifyToken, middleware]
        : middleware;
}