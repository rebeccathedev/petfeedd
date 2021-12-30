const { merge } = require("webpack-merge");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

var webpack = require("./webpack.config");

module.exports = merge(webpack, {
  entry: {
    main: path.join(__dirname, "src/Public/index.js"),
  },
  output: {
    path: path.join(__dirname, "build/public"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src"),
          to: path.join(__dirname, "build"),
          filter: async (resourcePath) => resourcePath.match("Public") == null
        },
        {
          from: path.join(__dirname, "package*"),
          to: path.join(__dirname, "build"),
        },
      ],
    }),
  ],
});
