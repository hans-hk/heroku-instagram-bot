const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    entry: './src/js/main.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src/js')
      ],
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2015', 'stage-0']
        }
      }
    }]
  },
  devtool: 'source-map',
  mode: 'development'
};
