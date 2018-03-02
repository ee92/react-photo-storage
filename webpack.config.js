module.exports = {
  entry: "./src/app.jsx",
  output: {
    filename: "public/bundle.js",
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ['react', 'es2015', 'stage-1']
          }
        }
      },
      {
        test: /\.css$/,
        use: 'css-loader/locals'
      },
      {
        test: /\.png$/,
        use: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
