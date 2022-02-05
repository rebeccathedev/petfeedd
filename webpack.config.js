const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: path.join(__dirname, "src/Public/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "output/public"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(__dirname, "output")
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src"),
          to: path.join(__dirname, "output"),
          filter: async (resourcePath) => resourcePath.match("Public") == null
        },
        {
          from: path.join(__dirname, "package*"),
          to: path.join(__dirname, "output"),
        },
      ],
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "petfeedd"
    }),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.esm.js",
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
};
