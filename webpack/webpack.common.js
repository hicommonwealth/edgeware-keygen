const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../client/app.js')
  },
  devServer: {
    headers: {
      'P3P': 'CP="This site does not have a P3P compact privacy policy"',
    },
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], { root: Path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: 'public' },
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../client/index.html')
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['../client', '..', '../node_modules'],
    alias: {
      '~': Path.resolve(__dirname, '..')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: [Path.resolve(__dirname, '../client'), Path.resolve(__dirname, '../adapters')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
    ]
  }
};
