var app = require('koa')()
  , router = require('koa-router')()
  , ws = require('ws')
  ,fs = require('fs')
  ,uuid = require('node-uuid');

var sever = app.listen(8081);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: sever
});

var userList = [];
var msgNum = 0;

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

wss.on('connection', function (ws) {
  console.log("在线人数", wss.clients.length);
  console.log('----链接成功----');

  ws.on('message', function (msg) {
    var message = JSON.parse(msg);
    console.log('====================');
    console.log(message);
    var msgType = message.type;

    switch (msgType) {
      // 用户登录
      case 'userLogin':
        var username = message.username;
        userList.push(username);
        // 广播所有人谁登陆了
        var loginData = {
          type: 'userLogin',
          userNum: wss.clients.length,
          userName: username
        };
        wss.broadcast(loginData);

        // 获取已在线用户列表
        var listData = {
          type: 'list',
          userList: userList
        };
        console.log(listData);
        ws.send(JSON.stringify(listData));
        break;
      // 接收消息
      case 'message':
        var dateTime = Date.parse(new Date());
        message.dateTime = dateTime;
        wss.broadcast(message);
        break;
      // 测试
      case 'test':
        var leaveUser = userList;
        msgNum --;
        console.log('+++++++++++++++');
        console.log(msgNum);
        if (msgNum == 0) {
          leaveUser.remove(message.username);
          var logoutData = {
            type: 'logout',
            userName: leaveUser[0]
          };
          wss.broadcast(logoutData);
        } else {
          leaveUser.remove(message.username);
        }
        break;
    }

  });

  ws.on('close', function (close) {
    console.log("用户退出,在线人数" + wss.clients.length);
    var testData = {
      type: 'test'
    };
    wss.leaveBroadcast(testData);


  });
});

//为wss对象添加广播方法
wss.broadcast = function (data) {
  console.log('--------------广播---------------');
  console.log(data);
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(data));
  });
};

wss.leaveBroadcast = function (data) {
  console.log('--------------退出广播---------------');
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(data));
    msgNum ++;
    console.log(msgNum);
  });
};

router.get('/', function *(next) {
  var ctx = this;

});

router.post('/image', function *(next) {
  var imgData= this.request.body.imageData;

  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');

  var date = new Date();
  var today = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDay().toString();
  console.log(today);

  //创建目录
  var publicRoot = "public/";
  var file = "images/" + today;
  var publicFile = publicRoot + file;
  var imgName = uuid.v1().replace(/\-/g,'') + '.png';

  yield fs.exists(publicFile, function(exists) {
    if (exists) {
      console.log('存在');

    } else {
      console.log('不存在');
      fs.mkdir(publicFile, function (err) {
        if (err) {
          console.log('创建目录失败');
        } else {
          console.log('创建目录成功');
        }
      })
    }
  });

  yield fs.writeFile(publicFile + '/' + imgName, dataBuffer, function(err) {
      if(err){
        console.log(err);
        console.log("保存失败!");
        /*ctx.body = {
          error: err
        };*/
      }else{
        console.log('保存成功!');
        /*ctx.body = {
          imgPath: file + '/' + imgName
        };*/
      }
    });
});

module.exports = router;
