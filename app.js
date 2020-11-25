const Koa = require('koa')
const app = new Koa()
const router = require('./src/route')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const BizError = require('./utils/bizError')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  try {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`)
  } catch (error) {
    if (error instanceof BizError) {
      ctx.body = {
        status: 500,
        msg: error.message,
        body: null
      }
    } else {
      ctx.body = {
        status: 502,
        msg: "未知异常",
        body: null
      }
    }
    console.log(`${ctx.request.method} ${ctx.request.url} ${error.message}`)
  }
})

app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app