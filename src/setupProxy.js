const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const password = process.env.PROXY_PASSWORD;
  const username = process.env.PROXY_USERNAME;

  const stagingUrl = 'https://nxt3.staging.lizard.net/';
  // const prodUrl = 'https://demo.lizard.net/';

  let proxyMiddleware;
  if (!password || !username) {
    console.log("Proceeding without username password !");
    proxyMiddleware = createProxyMiddleware({
      target: stagingUrl,
      changeOrigin: true,
    });
  } else {
    // Use HTTP basic auth, works with Lizard only
    proxyMiddleware = createProxyMiddleware({
      target: stagingUrl,
      changeOrigin: true,
      auth: `${username}:${password}`,
    });
  }

  app.use('/api', proxyMiddleware);
  app.use('/bootstrap', proxyMiddleware);
  app.use('/wms', proxyMiddleware);
  app.use('/proxy', proxyMiddleware);
};