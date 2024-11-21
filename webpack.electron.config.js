const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  entry: {
    main: './electron/main.ts',
    preload: './electron/preload.ts', 
  },
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
    },
};