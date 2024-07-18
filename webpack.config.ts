const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(png|jp(e*)g|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      favicon: "./src/asset/favicon.ico",
    }),
  ],
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },
};
