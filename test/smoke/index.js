const  path = require("path")
const  webpack = require("webpack");
// 使用rimraf库
//安装npm i rimraf -D
//安装npm i glob-all -D
// process.chdir(path.join() __dirname);
//单元测试使用mocha
 const rimraf = require("rimraf");
 const  Mocha = require("mocha")
const mocha = new Mocha({
    timeout:'1000ms'
})
 rimraf('../../dist',()=>{
   const  prodConfig = require("../../webpack.prod");
   webpack(prodConfig,(err,stats)=>{
    if(err){
     console.error(err);
     process.exit(2);
    }
    console.log(stats.toString({
     colors: true,
     modules: false,
     children:false
    }))
       console.log('webpack build success, begin run test')
       mocha.addFile(path.join(__dirname,'html-test.js'))
       mocha.addFile(path.join(__dirname,'css-js-test.js'))
       mocha.run();
   })
 })
