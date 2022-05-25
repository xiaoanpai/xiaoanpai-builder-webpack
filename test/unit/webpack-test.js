const assert = require("assert")
//测试覆盖率 istanbul npm i istanbul -D
describe('webpack test case',()=>{
    const webpackConfig = require('../../webpack.dev.js');
    console.warn({webpackConfig})
    it('entry', function () {
        assert.equal(webpackConfig.entry.index,'/Users/cn-duncanwang/Desktop/code/demo/frondend/webpack/webpack-demo/src/index/index.js')
    });
})
