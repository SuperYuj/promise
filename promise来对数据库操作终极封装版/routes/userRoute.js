var express = require('express');
var userRouter = express.Router();
var querydb = require('./api');

/**
 * 登录界面
 */
userRouter.get('/', function (req, res) {
    res.render('login', {
        'message': '',
    });
});

/**
 * 登录提交
 */
userRouter.post('/login.do', function (req, res, next) {
    var userName = req.body.name;
    var passWord = req.body.password;

    var sql = 'SELECT id,username,password FROM user WHERE username = ? AND password = ?';
    var parameters = [userName, passWord];

    querydb(sql, parameters)
        .then(function (data) {
            if (data.length === 0) {
                res.render('login', {
                    'message': '用户名或密码出错！',
                });
            } else {
                res.render('index', {
                    'title': '主界面',
                    'name': '首页',
                });
            }
        })
        .catch(next);

});

/**
 * 用户添加
 */
userRouter.get('/add.do', function (req, res) {
    res.render('user/user_add');
});


/**
 * 添加用户提交
 */
userRouter.post('/add.do', function (req, res, next) {
    var userName = req.body.clientname;
    var passWord = req.body.password;

    var sql = 'INSERT INTO user (username,password)VALUES (?,?)';
    var paramers = [userName, passWord];

    querydb(sql, paramers)
        .then(function (data) {
            res.redirect('/list.do');
        })
        .catch(next);

});

/**
 * 用户列表
 */
userRouter.get('/list.do', function (req, res, next) {
    var sql = 'SELECT id,username,password FROM user';
    querydb(sql)
        .then(function (data) {
            res.render('user/user_list', {
                'userLists': data,
            });
        })
        .catch(next);

});


/**
 * 删除用户
 */
userRouter.get('/delete', function (req, res, next) {
    // 接收get请求参数
    var id = req.query.uid;
    var sql = 'DELETE FROM user WHERE id = ?';
    var parameters = [id];
    querydb(sql, parameters)
        .then(function (data) {
            res.redirect('/list.do');
        })
        .catch(next);

});

/**
 * 根据ID查询用户
 */
userRouter.get('/find', function (req, res, next) {
    // 接收get请求参数
    // var id = req.params.uid;
    var id = req.query.uid;
    var sql = 'SELECT id,username,password FROM user WHERE id = ?';
    var parameters = [id];

    querydb(sql, parameters)
        .then(function (data) {
            res.render('user/user_update', data[0]);
        })
        .catch(next);
});

/**
 * 修改用户提交
 */
userRouter.post('/update', function (req, res, next) {
    var username = req.body.clientname;
    var password = req.body.password;
    var id = req.body.uid;
    var parametes = [username, password, id];

    var sql = 'UPDATE user SET username = ?, password = ? WHERE id = ?';
    querydb(sql, parametes)
        .then(function (data) {
            res.redirect('/list.do');
        })
        .catch(next);

});


module.exports = userRouter;
