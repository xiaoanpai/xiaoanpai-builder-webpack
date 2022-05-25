'use strict'

const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugin = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
    console.warn({ entryFiles });
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index-server\.js/);
        const pageName = match && match[1];
        if (pageName) {
            entry[pageName] = entryFile;
            htmlWebpackPlugin.push(new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: ['vendors', 'commons', pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            }))
        }

    })
    return {
        entry,
        htmlWebpackPlugin
    }
}
const { entry, htmlWebpackPlugin } = setMPA();
module.exports = {
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-server.js',
        libraryTarget: 'umd'
    },
    mode: 'none',
    module: {
        /*
        css-loader用于加载.css文件，并且转换成common.js对象
        style-loader将样式通过style标签插入到head中
        */
        rules: [{
            test: /.js$/,
            use: 'babel-loader'
        },
        {
            test: /.less$/,
            use: [
                // 'style-loader',
                miniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
                'postcss-loader',
                // { 不兼容
                //     loader: 'postcss-loader',
                //     options: {
                //         plugins: () => [
                //             require('autoprefixer')({
                //                 browsers: ['last 2 version', '>1%', 'ios 7']
                //             })
                //         ]
                //     }
                // }
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,//1rem等于75px
                        remPrecision: 8, //转换后小数点位数
                    }
                }
            ]
        }, {
            test: /.(png|jpg|gif|jpeg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]',
                    limit: 10024
                }
            }]//'file-loader'
        },
        ], //test指定匹配规则 use指定使用的loader名称

    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), //webpack5
        ],
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new CleanWebpackPlugin(),
    ].concat(htmlWebpackPlugin),
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    // externals: [
    //     'react',
    //     'react-dom'],
    devtool: 'inline-source-map'
}