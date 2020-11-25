const router = require('koa-router')()
const Joi = require('joi')
const validate = require('../../utils/joi')
const BizError = require('../../utils/bizError')
const fs = require('fs')
const moment = require('moment')

const mood_path = '../documents/config/mood/index.json'

router.prefix('/mood')

router.get('/', async function (ctx, next) {
    let moods = [];
    const getMoods = new Promise((resolve, reject) => {
        try {
            fs.readFile(mood_path, 'utf8', (err, data) => {
                if (!err) {
                    const content_json = JSON.parse(data)
                    moods = content_json.content
                    return resolve(moods)
                } else {
                    return reject(new BizError('数据查询失败'))
                }
            })
        } catch (err) {
            return reject(new BizError('数据查询失败'))
        }
    })

    moods = await getMoods;
    ctx.body = {
        status: 1,
        msg: null,
        body: moods
    };
})

router.post('/', function (ctx, next) {
    const schema = Joi.object().keys({
        content: Joi.string().required().label('内容')
    })
    const {
        content
    } = validate(ctx.request.body, schema)
    // console.log(moment(Date()).format("YYYY-MM-DD"))
    try {
        fs.readFile(mood_path, 'utf8', (err, data) => {
            if (!err) {
                const content_json = JSON.parse(data)
                content_json.content.unshift({
                    date: moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"),//moment(Date()).format("YYYY-MM-DD"),
                    content: content
                })
                fs.writeFile(mood_path, JSON.stringify(content_json), err => {
                    //文件写入成功。
                })
            }

        })
    } catch (error) {
        throw (new BizError('操作失败！'))
    }

    ctx.body = {
        status: 1,
        msg: '上传成功!',
        body: null
    };

})

router.post('/delete', function (ctx, next) {
    const schema = Joi.object().keys({
        index: Joi.number().required().label('标号')
    })
    const {
        index
    } = validate(ctx.request.body, schema)
    // console.log(moment(Date()).format("YYYY-MM-DD"))
    try {
        fs.readFile(mood_path, 'utf8', (err, data) => {
            if (!err) {
                const content_json = JSON.parse(data)
                content_json.content.splice(index, 1)
                fs.writeFile(mood_path, JSON.stringify(content_json), err => {
                    //文件写入成功。
                })
            }
        })
    } catch (error) {
        throw (new BizError('操作失败！'))
    }
    ctx.body = {
        status: 1,
        msg: '操作成功!',
        body: null
    };
})

router.post('/edit', function (ctx, next) {
    const schema = Joi.object().keys({
        index: Joi.number().required().label('标号'),
        content: Joi.string().required().label('内容'),
    })
    const {
        index,
        content
    } = validate(ctx.request.body, schema)
    // console.log(moment(Date()).format("YYYY-MM-DD"))
    try {
        fs.readFile(mood_path, 'utf8', (err, data) => {
            if (!err) {
                const content_json = JSON.parse(data)
                content_json.content[index].content = content
                fs.writeFile(mood_path, JSON.stringify(content_json), err => {
                    //文件写入成功。
                })
            }
        })
    } catch (error) {
        throw (new BizError('操作失败！'))
    }
    ctx.body = {
        status: 1,
        msg: '操作成功!',
        body: null
    };
})

module.exports = router