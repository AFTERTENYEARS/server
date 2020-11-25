const mysql = require('../store/mysql')

exports.searchUserAll = async ({
    sex
}, connection = mysql) => {
    const sql = `
    SELECT
        *
    FROM
        user
    WHERE
        sex = ?
    `
    const params = [sex]
    const result = await connection(sql, params)
    return JSON.parse(JSON.stringify(result))
}