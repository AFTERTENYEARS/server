const BizError = require('./bizError')

exports.errorHandle = (error, ctx) => {
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
}