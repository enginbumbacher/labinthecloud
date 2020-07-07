const path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'litc-main.js',
    path: path.resolve(__dirname, 'client/cslib')
  },
  cache: true,
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'lib/module']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            exportAsEs6Default: true
          }
        }
      },
      // {
      //   test: /\.(png|jpg|svg|gif)$/,
      //   use: [{
      //     loader: 'url-loader',
      //     options: {
      //       limit: 100,
      //       name: 'images/[hash]-[name].[ext]',
      //       publicPath: "cslib/"
      //     }
      //   }]
      // },
      {
        test: /\.([ot]tf|woff2|woff|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'fonts/[name].[ext]',
            publicPath: 'cslib/'
          }
        }
      }
    ]
  }
};;
