var path = require("path")
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            import: true
                        }
                    }
                ],
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
    })]
};