var app = require('koa')()
  , router = require('koa-router')()
  , ws = require('ws');

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
    if(msgType == 'userLogin') {//用户登录
      var username = message.username;
      userList.push(username);
      var loginData = {
        type: 'userLogin',
        userNum: wss.clients.length,
        userName: username
      };
      wss.broadcast(loginData);

      var listData = {
        type: 'list',
        userList: userList
      };
      console.log(listData);
      ws.send(JSON.stringify(listData));
    } else if (msgType == 'message') {//接收消息
      // var msgData = JSON
      var dateTime = Date.parse(new Date());
      message.dateTime = dateTime;
      wss.broadcast(message);
    } else if (msgType == 'test') {
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

module.exports = router;
