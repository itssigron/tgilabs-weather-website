const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Use proxy only for development
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        app.use(
            '/api',
            createProxyMiddleware({
                target: 'http://localhost:3001',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '', // Remove the /api prefix from the path
                },
            })
        );
    }
};