<template>
  <div id="app">
    <div class="member-num">当前在线{{userNum}}人</div>

    <div class="message">
      <div class="content">
        <div class="content-inner"></div>
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
      editingMsg: ''//输入框中的消息
    }
  },
  mounted: function () {
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
              console.log(msgData.userNum);
            break;
          //用户列表
          case 'list':
            vm.userList = msgData.userList;
            break;
          //接收消息
          case 'message':

            break;
          //用户退出
          case 'logout':
            console.log(msgData);
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
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
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
    padding-left: 10px;
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
    overflow: hidden;
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

</style>
