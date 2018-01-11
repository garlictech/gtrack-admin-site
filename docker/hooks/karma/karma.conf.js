// The parameter is the prepared weback config, as the conteiner would use. There is no more configuration
// after calling this function.

var webpack = require('webpack');

module.exports = function(karmaConfig) {
  // ===== yeoman hook config end =====
  // DO NOT REMOVE THE ABOVE LINE! Generators may not work.

  karmaConfig.files.push({
    pattern: './node_modules/jquery/dist/jquery.min.js',
    watched: false
  });
  karmaConfig.files.push({
    pattern: './node_modules/bootstrap/dist/js/bootstrap.js',
    watched: false
  });
  karmaConfig.files.push({
    pattern: './node_modules/popper.js/dist/umd/popper.min.js',
    watched: false
  });
  karmaConfig.files.push({
    pattern: './node_modules/bootstrap-material-design/dist/js/bootstrap-material-design.min.js',
    watched: false
  });

  karmaConfig.webpack.plugins.push(
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: 'popper.js'
    })
  );
};
