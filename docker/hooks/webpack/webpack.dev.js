// The parameter is the prepared weback config, as the conteiner would use. There is no more configuration
// after calling this function.

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
