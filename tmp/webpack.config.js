var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './_assets/js/src/index.js'],
  output: {
    path: path.resolve(__dirname, '_assets/js'),
    filename: 'wiki.js',
    sourceMapFilename: 'wiki.map'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: '../static/media'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs', '.wasm']
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
