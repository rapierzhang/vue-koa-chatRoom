<template>
  <div id="app">
    <div class="member-num">当前在线{{userNum}}人</div>

    <div class="message">
      <div class="content">
        <div class="content-inner">

          <div class="message-outer" v-for="message in messageList">
            <div class="other-message" v-if="message.user != username">
              <p class="other-name">{{message.user}} {{message.dateTime | time}}</p>
              <div class="other-content">
                {{message.ctx}}
              </div>
            </div>

            <div class="myself-message" v-else="message.user != username">
              <p class="myself-name">{{message.user}} {{message.dateTime | time}}</p>
              <div class="myself-content">
                {{message.ctx}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="user-list" v-for="userItem in userList">
          {{userItem}}
        </div>
      </div>
    </div>

    <div class="foot-bar">
      <div class="input">
        <div class="edit-area">

          <div class="tool-bar">
            <div class="font-size" >
              字体大小:
            </div>
            <select id="select" class="select" v-model="fontSize">
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="22px">22px</option>
              <option value="24px">24px</option>
              <option value="26px">26px</option>
              <option value="28px">28px</option>
              <option value="30px">30px</option>
              <option value="32px">32px</option>
              <option value="34px">34px</option>
              <option value="36px">36px</option>
              <option value="38px">38px</option>
              <option value="40px">40px</option>
              <option value="42px">42px</option>
            </select>

            <div class="font-color" @click="showColors()">
              字体颜色
              <div class="font-color-list" v-show="showColor">
                <div class="font-color-block" v-for="list in colorList">
                  <div class="font-color-item" v-for="item in list" :style="{background: item}"></div>
                </div>
              </div>
            </div>

            <div class="upload" @click="file()">
            </div>
            <input type="file" id="file" style="display: none;">
          </div>

          <textarea class="textarea" cols="50" rows="10" v-model="editingMsg" @keyup.enter="send()"></textarea>
        </div>
        <div class="button-bar">
          <button class="send" @click="send()">发送</button>
          <button class="empty" @click="empty()">清空</button>
        </div>
      </div>
    </div>

    <div class="input-username" v-if="inputName">
      <h3 class="username-title">请输入用户名</h3>
      <input class="username-input" type="text" v-model="username" @keydown.enter="saveUsername">
      <button class="username-button" @click="saveUsername()">确认</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      inputName: true,//编辑用户名
      username: '',//用户名
      userNum: '0',//在线用户数量
      fontSize: '12px',
      color: '#000',
      ws: '',//websocket
      userList: [],//用户列表
      messageList: [],//消息列表
      editingMsg: '',//输入框中的消息
      showColor: false,//颜色选项框
      colorList: [
        ["#000000","#003300","#006600","#009900","#00CC00","#00FF00","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF"],["#330000","#333300","#336600","#339900","#33CC00","#33FF00","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF"],["#660000","#663300","#666600","#669900","#66CC00","#66FF00","#660033","#663333","#666633","#669933","#66CC33","#66FF33","#660066","#663366","#666666","#669966","#66CC66","#66FF66","#660099","#663399","#666699","#669999","#66CC99","#66FF99","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF"],["#990000","#993300","#996600","#999900","#99CC00","#99FF00","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF"],["#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF"],["#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"]
      ]
    }
  },
  filters: {
    time: function (value) {
      var date = new Date(value);
      return date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8);
    }
  },
  mounted: function () {
    Array.prototype.remove = function(val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    this.initWebSocket();

  },
  methods: {
    initWebSocket: function () {
      var vm = this;
      vm.ws = new WebSocket("ws://10.10.33.19:8081");
      vm.ws.onopen = function (e) {
        console.log('websocket 链接服务端成功');
      };

      vm.ws.onmessage = function (msg) {
        var msgData = JSON.parse(msg.data);
        var type = msgData.type;
        switch (type) {
          //用户登录
          case 'userLogin':
            vm.userNum = msgData.userNum;
            vm.userList.push(msgData.userName);
            console.log(msgData.userNum);
            break;
          //用户列表
          case 'list':
            vm.userList = msgData.userList;
            break;
          //接收消息
          case 'message':
            var message = msgData;
            console.log(message);
            vm.messageList.push(message);
            break;
          //用户退出
          case 'logout':
            console.log(msgData);
            vm.userList.remove(msgData.userName);
            break;
          //退出轮询
          case 'test':
            var testData = {
              type: 'test',
              username: vm.username
            };
            vm.ws.send(JSON.stringify(testData));
            break;
        }
      }
    },
    saveUsername: function () {
      this.$data.inputName = false;
      var data = {
        type: 'userLogin',
        username: this.$data.username
      };
      //发送消息
      this.$data.ws.send(JSON.stringify(data));
    },
    send: function () {
      var vm = this;
      var msgData = {
        type: 'message',
        user: vm.username,
        userHeader: '',
        ctx: vm.editingMsg,
        fontSize: vm.fontSize,
        color: vm.color
      };
      vm.ws.send(JSON.stringify(msgData));
      vm.editingMsg = '';
      var textarea = document.getElementsByClassName('textarea')[0];
      textarea.focus();
    },
    empty: function () {
      this.$data.editingMsg = '';
    },
    logout: function () {

    },
    showColors: function () {
      this.showColor = true;
    },
    file: function () {
      var file = document.getElementById('file');
      file.click();
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 15px;
    width: 100%;
    height: 100%;
  }

  .member-num {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }

  .message {
    width: 60%;
    height: 480px;
    margin: 0 auto;
  }

  .content {
    width: 70%;
    height: 100%;
    float: left;
    overflow-y: scroll;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .content-inner {
    width: 100%;
    height: auto;
    padding: 0 10px;
  }

  .sidebar {
    width: 28%;
    height: 100%;
    float: right;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .user-list {
    width: 100%;
    height: 20px;
    padding: 5px 10px;
    text-align: left;
  }

  .foot-bar {
    width: 60%;
    height: 150px;
    margin: 20px auto;
  }

  .input {
    width: 70%;
    height: 160px;
    float: left;
  }

  .edit-area {
    width: 100%;
    height: 120px;
    border: 1px solid #ddd;
  }

  .tool-bar {
    width: 100%;
    height: 30px;
    float: left;
    border-bottom: 1px solid #ddd;
  }

  .textarea {
    width: 100%;
    height: 87px;
    float: left;
    border: none;
    padding: 10px;
    font-size: 14px;
    outline: none;
  }

  .button-bar {
    width: 100%;
    height: 30px;
    float: left;
    margin-top: 10px;
  }

  .empty {
    width: 60px;
    height: 30px;
    float: right;
    border: none;
    border-radius: 5px;
    background: #ccc;
    color: #fff;
    font-size: 14px;
    outline: none;
  }

  .send {
    width: 60px;
    height: 30px;
    float: right;
    border: none;
    border-radius: 5px;
    background: #00a1d6;
    color: #fff;
    font-size: 14px;
    outline: none;
    margin-left: 20px;
  }

  .input-username {
    width: 300px;
    height: 150px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -75px;
    margin-left: -150px;
  }

  .username-title {
    padding: 15px 10px;
  }

  .username-input {
    width: 180px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-size: 16px;
    border-radius: 5px;
    margin: 0 auto;
    display: block;
  }

  .username-button {
    width: 80px;
    height: 30px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    background: #00a1d6;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }

  .message-outer {
    width: 100%;
    overflow: hidden;
  }

  .other-message {
    max-width: 45%;
    min-height: 30px;
    margin: 10px 0;
    float: left;
  }

  .other-name {
    text-align: left;
    font-size: 14px;
    padding: 5px;
  }

  .other-content {
    text-align: left;
    font-size: 14px;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 8px;
  }

  .myself-message {
    max-width: 45%;
    min-height: 30px;
    margin: 10px 0;
    float: right;
  }

  .myself-name {
    text-align: left;
    font-size: 14px;
    padding: 5px;
  }

  .myself-content {
    text-align: left;
    font-size: 14px;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 8px;
  }

  /*-----------tool bar-------------*/
  .font-size {
    float: left;
    font-size: 14px;
    width: 80px;
    height: 28px;
    line-height: 28px;
  }

  .font-color {
    float: left;
    width: 60px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    position: relative;
  }

  .font-color-list {
    width: 239px;
    height: 204px;
    padding: 50px 10px 10px 10px;
    position: absolute;
    left: 0;
    top: -204px;
    background: #fff;
    border: 1px solid #ddd;
    overflow: hidden;
    border-radius: 5px;
  }

  .font-color-block {
    width: 72px;
    height: 72px;
    float: left;
  }

  .font-color-block:nth-child(3n-2){
    width: 73px;
    border-left: 1px solid #000;
  }

  .font-color-block:nth-child(1) {
    height: 73px;
    border-top: 1px solid #000;
  }

  .font-color-block:nth-child(2) {
    height: 73px;
    border-top: 1px solid #000;
  }

  .font-color-block:nth-child(3) {
    height: 73px;
    border-top: 1px solid #000;
  }

  .font-color-item {
    width: 12px;
    height: 12px;
    float: left;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  .select {
    float: left;
    width: 50px;
    height: 28px;
    border: none;
    outline: none;
  }

  .upload {
    float: left;
    width: 28px;
    height: 28px;
    background-image: url('/images/sprite31e225_03.png');
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: 5px 5px;
  }

</style>
