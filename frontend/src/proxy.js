const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/', // Specify the API route or endpoint you want to proxy
    createProxyMiddleware({
      target: 'http://localhost:4000', // Replace with your backend server URL
      changeOrigin: true,
    })
  );
};