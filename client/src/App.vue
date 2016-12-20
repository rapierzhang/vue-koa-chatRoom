<template>
  <div id="app">
    <div class="member-num">当前在线 人</div>

    <div class="message">
      <div class="content">
        <div class="content-inner"></div>
      </div>
      <div class="sidebar">

      </div>
    </div>

    <div class="foot-bar">
      <div class="input">
        <div class="edit-area">
          <div class="tool-bar">

          </div>
          <textarea class="textarea" cols="50" rows="10"></textarea>
        </div>
        <div class="button-bar">
          <button class="send">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      userNum: '',
      userList: [],
      messageList: []
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

  .send {
    width: 60px;
    height: 30px;
    float: right;
    border: none;
    border-radius: 5px;
    background: #00a1d6;
    color: #fff;
    font-size: 14px;
  }

</style>
