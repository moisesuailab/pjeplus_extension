import path from "path"
import webpack from "webpack"
import CopyWebpackPlugin from "copy-webpack-plugin"
import fg from "fast-glob";

// Use fast-glob to get all TypeScript files in the src directory
const entries: { [key: string]: string } = fg.sync("./src/**/*.ts").reduce((acc: { [key: string]: string }, file: string) => {
  const name = path.basename(file, path.extname(file));
  acc[name] = file;
  return acc;
}, {});

const config: webpack.Configuration = {
  entry: entries,
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-import", "tailwindcss"],
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Clean the output directory before emit.
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
}

export default config