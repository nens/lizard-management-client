const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const password = process.env.PROXY_PASSWORD;
  const username = process.env.PROXY_USERNAME;

  const proxyMiddleware = createProxyMiddleware({
    target: 'https://nxt3.staging.lizard.net/',
    // target: 'https://demo.lizard.net/',
    changeOrigin: true,
  });

  if (!password || !username) {
    console.log("Proceeding without username password !");
  } else {
    // Use HTTP basic auth, works with Lizard only
    proxyMiddleware.auth = `${username}:${password}`;
  }

  app.use('/api', proxyMiddleware);
  app.use('/bootstrap', proxyMiddleware);
  app.use('/wms', proxyMiddleware);
  app.use('/proxy', proxyMiddleware);
};