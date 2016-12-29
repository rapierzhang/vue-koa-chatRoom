var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  , cors = require('koa-cors');

var index = require('./routes/index');
var users = require('./routes/users');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
//设置请求体长度
app.use(require('koa-bodyparser')({
  "formLimit":"5mb",
  "jsonLimit":"5mb",
  "textLimit":"5mb"
}));
app.use(json());
app.use(logger());
app.use(cors());//设置跨域

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/socket', index.routes(), index.allowedMethods());

// mount root routes  
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
