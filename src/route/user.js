const router = require('koa-router')()
const Joi = require('joi')
const validate = require('../../utils/joi')
const {
  getUserAll
} = require('../service/user')


router.prefix('/user')


router.get('/', function (ctx, next) {
  ctx.body = {
    'nickName': "tom",
    'mobile': '17666111185',
    'link': 'https://www.baidu.com'
  };
})

router.post('/update/nickName', async (ctx, next) => {
  const requestBody = ctx.request.body;
  if (!requestBody.nickName) {
    ctx.body = {
      statusCode: false,
      msg: "昵称不存在"
    }
  } else {
    const nickName = requestBody.nickName;
    // 入库操作
    ctx.body = {
      statusCode: true,
      nickName: nickName,
      msg: "昵称修改成功"
    }
  }
});

router.get('/sex', async (ctx, next) => {
  const schema = Joi.object().keys({
    sex: Joi.number().required().label('性别')
  })
  const {
    sex
  } = validate(ctx.query, schema)

  const data = await getUserAll({
    sex: sex
  })
  ctx.body = data
})

module.exports = router