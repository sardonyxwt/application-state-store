const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [
    new CleanWebpackPlugin('dist'),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true
    }),
    new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: `${__dirname}/bundle-report.html`
    })
];

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    output: {
        filename: "./dist/application-state-store.js",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins
};