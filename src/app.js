var path = require('path');
import admin from './../router/admin'
import role from './../router/role'
import right from './../router/right'
import banner from './../router/banner'
import article from './../router/article'
import tag from './../router/tag'
import user from './../router/user'
import book from './../router/book'
import event from './../router/event'
import comment from './../router/comment'
import pin from './../router/pin'
const express = require('express')
const app = express();
const mongoose  = require('mongoose')
import config from "./config"
import dbs from "./dbs"
import "babel-polyfill";
const passport = require("passport");       //引入passport插件

var compression = require('compression')
app.all('*', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'Content-type');
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    //可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。
    res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
    next();
});


// 3.引入路由

// 连接数据库
mongoose.set('useCreateIndex', true) //加上这个
mongoose.connect(dbs.data_url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(err,res)=>{
    if (err){
        console.log("连接数据库失败");
    } else{
        console.log("连接数据库成功");
    }
})


//尽量在其他中间件前使用compression
app.use(compression());

// 1.配置公共资源访问；路径

app.use(express.static(config.publicPath))



// 4.挂载路由


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({limit:"2100000kb"}))


app.use(passport.initialize());     //passport初始化
require("./passport")(passport);

app.use('/api/admin',admin)
app.use('/api/role',role)
app.use('/api/right',right)
app.use('/api/banner',banner)
app.use('/api/article',article)
app.use('/api/tag',tag)
app.use('/api/user',user)
app.use('/api/comment',comment)
app.use('/api/pin',pin)
app.use('/api/book',book)
app.use('/api/event',event)
// app.use((req,res)=>{
//     res.render('404.html')
// })

app.get('/a',(req,res)=>{
    res.send({
        a:123
    })
})
app.use(express.static(path.join(config.publicPath, 'dist'), { maxAge: 60 * 1000 * 60 * 24 * 365 }))
app.set("views",path.join(config.publicPath, 'dist'))
app.get('/a', function  (req, res, next) {
    res.send(12)
})

// app.get('/*', function  (req, res, next) {
//     res.sendFile(path.join(config.publicPath, './dist/index.html'))
// })
app.listen(5001,'0.0.0.0',()=>{
    console.log("服务器已经启动");
})
