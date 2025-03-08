const path= require('path')


module.exports = {
    entry: {
      index:'./src/index.js',
      auth: './src/auth.js',
      config: './src/config.js',
      citymanager: './src/citymanager.js'
    },
    output: {
      path: path.resolve(__dirname,'dist'),
      filename: '[name].bundle.js'
    },
    watch: true
  };
  