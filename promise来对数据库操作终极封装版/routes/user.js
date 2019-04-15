var express = require('express');
var db = require('../config/db');
var userRouter = express.Router();


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
userRouter.post('/login.do', function (req, res) {
    var userName = req.body.name;
    var passWord = req.body.password;

    console.log('userName ' + userName + ' passWord :' + passWord);
    var sql = 'SELECT id,username,password FROM user WHERE username = ? AND password = ?';
    var parameters = [userName, passWord];
    db.query(sql, parameters, function (err, data) {
        if (err) {
            console.log('数据库出错' + err);
            return;
        }
        console.log(data);
        console.log(data.length);
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
    });

});

/**
 * 用户添加
 */
userRouter.get('/add.do', function (req, res) {
    res.render('user/user_add');
});


/**
 * 用户列表
 * @type {Router|router}
 */
userRouter.get('/list.do', function (req, res) {
    // 查询数据库列表数据
    var sql = 'SELECT id,username,password FROM user';
    db.query(sql, function (err, data) {
        if (err) {
            console.log('查询数据失败' + err);
            return;
        }
        // console.log(JSON.stringify(data));
        // var userLists = '{"userLists": '+JSON.stringify(data)+' }';
        // console.log(userLists);
        // res.render('user/user_list',JSON.parse(userLists));

        res.render('user/user_list', {
            'userLists': data
        });
    });
});

/**
 * 添加用户提交
 */
userRouter.post('/add.do', function (req, res) {
    var userName = req.body.clientname;
    var passWord = req.body.password;

    var sql = 'INSERT INTO user (username,password)VALUES (?,?)';
    var paramers = [userName, passWord];

    db.query(sql, paramers, function (err, data) {
        if (err) {
            console.log('添加用户失败' + err);
            return;
        }
        console.log('添加用户成功');
        res.redirect('/list.do');
    });
});

/**
 * 删除用户
 * @type {Router|router}
 */
userRouter.get('/delete', function (req, res, next) {
    // 接收get请求参数
    var id = req.query.uid;
    console.log('id :' + id);

    var sql = 'DELETE FROM user WHERE id = ?';
    var parameters = [id];
    db.query(sql, parameters, function (err, data) {
        if (err) {
            console.log('删除失败' + err);
            return next(err);
        }
        console.log('删除成功!');

        res.redirect('/list.do'); // 重定向到用户列表界面，刷新列表数据
    });

});

userRouter.get('/update/:uid', function (req, res, next) {
    // 接收get请求参数
    var id = req.params.uid;
    // var id = req.query.uid;
    console.log('id :' + id);
    var sql = 'SELECT id,username,password FROM user WHERE id = ?';
    var parameters = [id];
    db.query(sql, parameters, function (err, data) {
        if (err) {
            console.log('查询失败' + err);
            return next(err);
        }

        console.log(data[0]);

        res.render('user/user_update', data[0]);
    });

});

userRouter.post('/update', function (req, res, next) {
    var username = req.body.clientname;
    var password = req.body.password;
    var id = req.body.uid;
    var sql = 'UPDATE user SET username = ?, password = ? WHERE id = ?';
    var parametes = [username, password, id];

    db.query(sql, parametes, function (err, data) {
        if (err) {
            console.log('修改失败' + err);
            return next(err);
        }
        console.log('修改成功!');

        res.redirect('/list.do'); // 重定向到用户列表界面，刷新列表数据
    });
});


module.exports = userRouter;
