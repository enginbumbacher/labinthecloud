const path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib-admin/style.scss',
  output: {
    filename: 'admin.css',
    path: path.resolve(__dirname, 'client/cslib/admin')
  },
  cache: true,
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'lib-admin/module']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 100,
            name: 'images/[hash]-[name].[ext]',
            publicPath: "cslib/"
          }
        }]
      },
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