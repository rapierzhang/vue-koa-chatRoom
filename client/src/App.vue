<template>
  <div id="app">
    <div class="member-num">当前在线{{userNum}}人</div>

    <div class="message">
      <div class="content">
        <div class="content-inner" id="content-inner">

          <div class="message-outer" v-for="message in messageList">
            <div class="other-message" v-if="message.user != username">
              <p class="other-name">{{message.user}} {{message.dateTime | time}}</p>
              <div class="other-content"
                   v-if="message.ctx"
                   :style="{color:message.color,
                   fontSize:message.fontSize,
                   fontWeight:message.fontWeight,
                   fontStyle:message.incline,
                   textDecoration:message.underline}">
                {{message.ctx}}
              </div>
              <div class="other-img"
                   v-if="message.imgPath">
                <img class="msg-images" :src="message.imgPath" alt="">
              </div>
            </div>

            <div class="myself-message" v-else="message.user != username">
              <p class="myself-name">{{message.user}} {{message.dateTime | time}}</p>
              <div class="myself-content"
                   v-if="message.ctx"
                   :style="{color:message.color,
                   fontSize:message.fontSize,
                   fontWeight:message.fontWeight,
                   fontStyle:message.incline,
                   textDecoration:message.underline}">
                {{message.ctx}}
              </div>
              <div class="self-img"
                   v-if="message.imgPath">
                <img class="msg-images" :src="message.imgPath" alt="">
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
            <!--字体大小-->
            <div class="font-size">
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

            <!--字体加粗-->

            <div class="font-outer" @click="selectWeight">
              <span class="font-bold" :class="pitchOnWeight">
                B
              </span>
            </div>

            <!--字体倾斜-->

            <div class="font-outer" @click="selectIncline()">
              <sapn class="font-incline" :class="pitchOnIncline">
                I
              </sapn>
            </div>

            <!--字体下划线-->

            <div class="font-outer" @click="selectUnderline()">
              <span class="font-underline" :class="pitchOnUnderline">
                U
              </span>
            </div>

            <!--选择颜色-->
            <div class="font-color" @click="showColors()" :style="{background: color}">

              <div class="font-color-list" v-show="showColor" @click.stop="">

                <div class="font-color-show">
                  <div class="font-color-blank" :style="{background: color}">

                  </div>
                  <input type="text" class="font-color-input" v-model="color">
                </div>

                <div class="color-outer">
                  <div class="font-color-outer">
                    <div class="font-color-block" v-for="list in colorList">
                      <div class="font-color-item" v-for="color in list" :style="{background: color}" @click.stop="selectColor(color)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="upload" @click="file()">
            </div>
            <input type="file" id="file" name="image" style="display: none;" @change="onFileChange">
          </div>

          <textarea id="textarea"
                    class="textarea"
                    cols="50" rows="10"
                    v-model="editingMsg"
                    @keyup.enter="send()"
                    :style="{color:color,
                    fontSize:fontSize,
                    fontWeight:fontWeight,
                    fontStyle:incline,
                    textDecoration:underline}"></textarea>
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
  import vueFileUpload from 'vue-file-upload'

  export default {
  name: 'app',
  data () {
    return {
      inputName: true,//编辑用户名
      username: '',//用户名
      userNum: '0',//在线用户数量
      fontSize: '12px',
      pitchOnWeight:'',
      fontWeight:'normal',//加粗bold
      pitchOnIncline:'',
      incline:'normal',//倾斜italic
      pitchOnUnderline:'',
      underline:'none',//下划线text-decoration:underline
      color: '#000000',
      ws: '',//websocket
      userList: [],//用户列表
      messageList: [],//消息列表
      imageList: [],//图片列表
      editingMsg: '',//输入框中的消息
      showColor: false,//颜色选项框
      colorList: [
        ["#000000","#003300","#006600","#009900","#00CC00","#00FF00","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF"],["#330000","#333300","#336600","#339900","#33CC00","#33FF00","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF"],["#660000","#663300","#666600","#669900","#66CC00","#66FF00","#660033","#663333","#666633","#669933","#66CC33","#66FF33","#660066","#663366","#666666","#669966","#66CC66","#66FF66","#660099","#663399","#666699","#669999","#66CC99","#66FF99","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF"],["#990000","#993300","#996600","#999900","#99CC00","#99FF00","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF"],["#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF"],["#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"]
      ],
      image: ''
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
      vm.ws = new WebSocket("ws://10.10.33.203:8081");
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
            // 浏览器通知
            if(window.Notification && Notification.permission !== "denied" && message.user != vm.username) {
              Notification.requestPermission(function(status) {
                var n = new Notification(message.user, { body: message.ctx });
              });
            }
            break;
          case 'image':
            var images = msgData;
              console.log(images);
            vm.messageList.push(images);
            vm.imageList.push(images);
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
        fontWeight: this.fontWeight,
        incline: this.incline,
        underline: this.underline,
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
      document.getElementById('textarea').focus();
    },
    logout: function () {

    },
    selectWeight: function () {
      if (this.fontWeight == 'normal') {
        this.fontWeight = 'bold';
        this.pitchOnWeight = 'active'
      } else {
        this.fontWeight = 'normal';
        this.pitchOnWeight = '';
      }
    },
    selectIncline: function () {
      if (this.incline == 'normal') {
        this.incline = 'italic';
        this.pitchOnIncline = 'active'
      } else {
        this.incline = 'normal';
        this.pitchOnIncline = ''
      }
    },
    selectUnderline: function () {
      if (this.underline == 'none') {
        this.underline = 'underline';
        this.pitchOnUnderline = 'active';
      } else {
        this.underline = 'none';
        this.pitchOnUnderline = '';
      }
    },
    showColors: function () {
      if (this.showColor == false) {
        this.showColor = true;
      } else {
        this.showColor = false;
      }
    },
    selectColor: function (color) {
      this.color = color;
    },
    // 单机触发file
    file: function () {
      var file = document.getElementById('file');
      file.click();
    },
    // 当文件改变时
    onFileChange: function (e) {
      var files = e.target.files || e.dataTransfer.files;
      console.log(e.target.files[0].name);
      this.imageName = e.target.files[0].name;
      if (!files.length)return;
      this.createImage(files);
    },
    // 将图片转为base64
    createImage: function (file) {
      if(typeof FileReader === 'undefined'){
        alert('您的浏览器不支持图片上传，请升级您的浏览器');
        return false;
      }
      var vm = this; //作用域
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload =function(e){
        vm.image = e.target.result;
        vm.uploadImage();
      };
    },
    // 上传图片
    uploadImage: function () {
      var vm = this;
      var imageAddUrl = "http://localhost:3000/socket/image";
      var imageAddData = {
        user: this.username,
        imageData: this.image
      };
      console.log(imageAddData);
      vm.$http.post(imageAddUrl, imageAddData, {emulateJSON: true})
          .then(
              function (res) {
                var resImgData = res.data;
                var imgPath = resImgData.imgPath;
                var imageName = vm.imageName;
                console.log(imgPath);
//                vm.articleCtx += `![${imageName}](http://127.0.0.1:3000/${imgPath})`;
              },
              function (res) {

              }
          );

    },
    // 计算高度
    countScroll: function () {
      var innerHerght = document.getElementById('content-inner').offsetHeight;
      var content = document.getElementsByClassName('content')[0];
      content.scrollTop = innerHerght;
    }
  },
  watch: {
    //监听数据改变
    messageList: function () {
      var vm = this;
    //监听dom改变
      vm.$nextTick(function () {
        vm.countScroll();
      })
    },
    imageList: function () {
      var vm = this;
      vm.$nextTick(function () {
        var images = document.getElementsByClassName('msg-images');
        var imagesLen = images.length;
         var image = images[imagesLen - 1];
        image.addEventListener('load', function () {
          vm.countScroll();
        })

      })
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

  /*-----------------侧边栏----------------*/

  .sidebar {
    width: 28%;
    height: 100%;
    float: right;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .user-list {
    width: 100%;
    padding: 2px 10px;
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
    cursor: pointer;
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
    cursor: pointer;
  }

  /*----------登录弹出框----------*/

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
    cursor: pointer;
  }

  /*----------消息----------*/

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

  .other-img {
    text-align: center;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 8px;
  }

  .other-img img {
    max-width: 100%;
  }

  .myself-message {
    max-width: 45%;
    min-height: 30px;
    margin: 10px 0;
    float: right;
  }

  .self-img {
    text-align: center;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 8px;
  }

  .self-img img {
    max-width: 100%;
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

  .font-outer {
    width: 30px;
    height: 20px;
    margin: 5px 0;
    line-height: 20px;
    text-align: center;
    border-right: 1px solid #ddd;
    float: left;
    font-weight: 700;
    cursor: pointer;
  }

  .font-bold {
    display: block;
    width: 20px;
    height: 20px;
    float: left;
    margin-left: 5px;
    line-height: 20px;
    text-align: center;
    border-radius: 3px;
  }

  .font-bold.active {
    background: #eee;
  }

  .font-incline {
    display: block;
    width: 20px;
    height: 20px;
    float: left;
    margin-left: 5px;
    line-height: 20px;
    font-style: italic;
    text-align: center;
    border-radius: 3px;
  }

  .font-incline.active {
    background: #eee;
  }

  .font-underline {
    display: block;
    width: 20px;
    height: 20px;
    float: left;
    margin-left: 5px;
    line-height: 20px;
    text-decoration: underline;
    text-align: center;
    border-radius: 3px;
  }

  .font-underline.active {
    background: #eee;
  }

  .font-color {
    float: left;
    width: 60px;
    height: 20px;
    font-size: 14px;
    line-height: 30px;
    position: relative;
    cursor: pointer;
    margin: 5px;
    border-radius: 3px;
  }

  .font-color-list {
    width: 239px;
    height: 204px;
    padding: 50px 10px 10px 10px;
    position: absolute;
    left: 0;
    top: -209px;
    background: #fff;
    border: 1px solid #ddd;
    overflow: hidden;
    border-radius: 5px;
    cursor: default;
  }

  .font-color-show {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 218px;
    height: 30px;
  }

  .font-color-blank {
    width: 80px;
    height: 30px;
    float: left;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .font-color-input {
    width: 126px;
    height: 30px;
    font-size: 16px;
    border: 1px solid #ddd;
    line-height: 30px;
    float: left;
    margin-left: 10px;
    padding-left: 10px;
    outline: none;
  }

  .color-outer {
    width: 216.5px;
    overflow: hidden;
  }

  .font-color-outer {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    width: 217px;
    overflow: hidden;
  }

  .font-color-block {
    width: 72px;
    height: 72px;
    float: left;
  }

  .font-color-item {
    width: 12px;
    height: 12px;
    float: left;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    cursor: pointer;
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
    cursor: pointer;
  }

</style>
