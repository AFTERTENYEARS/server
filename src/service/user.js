const {
    searchUserAll
} = require('../dao/user')

const BizError = require('../../utils/bizError')

exports.getUserAll = async ({
    sex
}) => {
    const result = await searchUserAll({
        sex
    })
    return result
}