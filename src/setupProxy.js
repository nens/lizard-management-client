const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const env_prefix = process.env.PROXY_PREFIX || 'STAGING';
  const url = process.env[env_prefix + '_URL'] || 'https://nens.lizard.net/';
  const apiKey = process.env[env_prefix + '_API_KEY'];

  // console.log("env_prefix", env_prefix)
  // console.log("url", url, process.env.STAGING_URL);
  // // exit if needed to view logs
  // process.exit(1);
  

  let proxyMiddleware;
  console.log(`Proxying to ${url}.`);

  if (!apiKey) {
    console.log('Without authentication.');
    proxyMiddleware = createProxyMiddleware({
      target: url,
      changeOrigin: true,
    });
  } else {
    // Use HTTP basic auth, works with Lizard only
    proxyMiddleware = createProxyMiddleware({
      target: url,
      changeOrigin: true,
      auth: `__key__:${apiKey}`,
    });
  }

  app.use('/api', proxyMiddleware);
  app.use('/bootstrap', proxyMiddleware);
  app.use('/wms', proxyMiddleware);
  app.use('/proxy', proxyMiddleware);
};
