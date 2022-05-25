module.exports = {
    plugins: [
        // postcss插件
        require('postcss-preset-env')({
            browsers: ['last 2 version', '>1%', 'ios 7']
        })
    ]
}