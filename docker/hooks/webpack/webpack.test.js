var webpack = require('webpack');

module.exports = function(webpackConfig) {
  // ===== yeoman hook config end =====
  // DO NOT REMOVE THE ABOVE LINE! Generators may not work.

  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  );
};
