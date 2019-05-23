const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const fs =  require('fs')
const jwt = require('koa-jwt')
const cors = require('koa2-cors')
const mongoConf = require('./config/mongo')

//使用了遍历路由 取消单个引入
// const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
onerror(app)
mongoConf.connect()
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//全局错误不抓
app.use(async (ctx, next) => {
  try {
      await next()
  } catch(err) {
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = err.message
      ctx.app.emit('error', err, ctx);
  }
})


//路由的权限验证过滤
app.use(jwt({ secret: 'yourstr' }).unless({
  path: [
      /^\/$/, /\/token/, /\/wechat/,/\/users/,
      { url: /\/papers/, methods: ['GET'] }
  ]
}));
// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
fs.readdirSync('./routes').forEach(route=> {
  let api = require(`./routes/${route}`)
  app.use(api.routes(), api.allowedMethods())
})




// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

//跨域处理
app.use(cors());

module.exports = app
