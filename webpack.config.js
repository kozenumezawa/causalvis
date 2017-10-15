const path = require('path');
const webpack = require('webpack');

const options = {
  entry: {
    bundle: './front/src/index.jsx'
  },
  output: {
    path: path.join(__dirname, 'front/dist'),
    filename: '[name].js'
  },
  devServer: {
    open: false,
    contentBase: path.join(__dirname, 'front/dist'),
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ['react', 'env']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      API_ENDPOINT: `'http://${process.env.NODE_ENV === 'production' ? '13.115.75.29' : 'localhost:3000'}'`,
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  // options.plugins.push(new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: false
  //   }
  // }));
} else {
  Object.assign(options, {
    devtool: 'inline-source-map'
  });
}

module.exports = options;