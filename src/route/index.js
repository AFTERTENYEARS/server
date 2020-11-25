const router = require('koa-router')()

const user = require('./user')
const mood = require('./mood')


// routes
router.use(user.routes(), user.allowedMethods())
router.use(mood.routes(), mood.allowedMethods())

module.exports = router