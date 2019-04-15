var userRouter = require('./routes/userRoute');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var createError = require('http-errors');

var app = express(); // 创建一个express实例,instance

app.use(bodyParser.json()); // 解析json类型数据

// expanded:false表示解析值类型是string|Array, true表示解析值是任意类型
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(express.static('public')); // 静态资源所有目录
app.use(userRouter); // use 加载 usreRouter

// 设置默认模板引擎是html
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', 'view'); // 模板所在的目录为view


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404)); // 创建404资源找不到错误,next方法交给error handler处理
});


// error handler; 处理所有错误
app.use(function (err, req, res, next) {
    console.log('err :' + err + '  err.status :' + err.status);
    res.status(err.status || 500); // 响应状态码如果没有响应500

    // 判断状态码显示404错误页面
    if (err.status === 404) {
        res.render('error/error404');
    } else {
        res.render('error/error', {
            message: err.message,
            error: {
                status: err.status,
                stack: err.stack,
            },
        });
    }
});


var port = 8080;
app.set('port', port);
app.listen(app.get('port'), function () {
    console.log('服务启动成功,监听8080端口');
});
