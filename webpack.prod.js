'use strict'

const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const webpack = require('webpack')
/* 
webpack🈯️支持js和json,通过loaders去支持其他文件类型并且把他们转化成有效的模块

常用loader:
    babel-loader:
    css-loader:
    less-loader:
    ts-loader:
    file-loader:    进行图片，字体等的打包
    raw-loader:     将文件以字符串的形式倒入
    thread-loader:   多进程打包js和css

plugins: 插件用于bundle文件的优化，资源管理和环境变量注入
    作用于整个构建过程

常用plugins:

    commonsChunkPlugin:     将chunks相同的模块代码提取成公共js
    cleanWebpackPlugin:     清理构建目录
    extractTextWebpackPlugin: 将css从bundle文件里提取成一个独立的css文件
    copywebpackPlugin:      将文件或者文件夹拷贝到构建的输出目录
    htmlWebpackPlugin:      创建html文件去承载输出的bundle
    uglifyjsWebpackPlugin:  压缩js
    ZipWebpackPlugin:       将打包出的资源生成一个zip包

mode:   用来指定当前的构建环境是：production,development还是none
    设置mode可以使用webpack内置函数，默认值为production

    development: 设置process.env.NODE_ENV的值为development 开启NamedChunksPlugin和NamedModelesPlugin

    production: 设置process.env.NODE_ENV的值为production 开启FlaDependencyUsagePlugin,FlagIncludedeChunksPlugin,ModuleConcatenationPlugin,NoEmitOnErrorsPlugin,
                OccurrenceOrderPlugin,SideEffectsFlagPlugin和TerserPlugin
    none:       不开启任何优化选项



webpack文件监听
    1启动webpakck命令时，带上--watch参数  // 需要手动刷新
    2在配置webpack.config.js中设置watch:true

热更新 webpack-dev-server 不用刷新浏览器

文件指纹：文件后缀，用作版本管理。更新对应的文件
    Hash:和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会更改
    Chunkhash:和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值。一般用于js文件
    Contenthash:根据文件内容来定义hash,文件内容不变，则contenthash不变。一般用于css等基本不会变的文件

    file-loader的name，使用hash [hash:8]取前八位，md5是32位
        [ext]           资源后缀名
        [name]          文件名称
        [path]          文件的相对路径
        [folder]        文件所在的文件夹
        [contenthash]   文件内容的hash,默认是md5生成
        [hash]          文件内容的hash,默认是md5生成
        [emoji]         一个随机的指代文件内容的emoji

*/
const glob = require('glob');
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugin = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    console.warn({ entryFiles });
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
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
    })
    return {
        entry,
        htmlWebpackPlugin
    }
}
const { entry, htmlWebpackPlugin } = setMPA();
module.exports = {
    entry,
    // entry: {
    //     index: './src/index.js',
    //     search: './src/search.js'
    // }, //用来指定打包入口
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'none',
    stats: {
        // Examine all modules
        // maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true,
    },
    module: {
        /*
        css-loader用于加载.css文件，并且转换成common.js对象
        style-loader将样式通过style标签插入到head中
        */
        rules: [{
            test: /.js$/,
            use: 'babel-loader'
        },
        // {
        //     test: /.css$/,
        //     use: [
        //         // 'style-loader',
        //         miniCssExtractPlugin.loader,
        //         'css-loader',
        //     ]
        // },
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
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(), //webpack5
        ],
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        // new OptimizeCssAssetsWebpackPlugin({ webpack4
        //     assetNameRegExp: /\.css$/g,
        //     cssProcessor: require('cssnano')
        // })

        // new htmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/search.html'),
        //     filename: 'search.html',
        //     chunks: ['search'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),
        // new htmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/index.html'),
        //     filename: 'index.html',
        //     chunks: ['index'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),

        new CleanWebpackPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             // 地址可以是本地文件或者cdn文件
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
        //             global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
        //             global: 'ReactDom'
        //         },
        //     ]
        // }),
        // new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(htmlWebpackPlugin),
    optimization: {
        splitChunks: {
            // cacheGroups:{
            //     commons:{
            //         test:/(react|react-dom)/,
            //         name:'vendors',
            //         chunks:'all'
            //     }
            // }
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