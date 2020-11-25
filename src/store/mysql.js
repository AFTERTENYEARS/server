const mysql = require('mysql')
const BizError = require('../../utils/bizError')
// 创建数据池
const pool = mysql.createPool({
    host: '127.0.0.1', // 数据库地址
    user: 'root', // 数据库用户
    password: '12345678', // 数据库密码
    database: 'sys', // 选中数据库
    // connectionLimit: 100 // 最大连接数
})

pool.on('connection', (connection) => {
    console.log('MYSQL数据库连接已分配')
    connection.on('error', (err) => {
        console.log('MYSQL数据库操作错误:%s', err)
    })
    connection.on('end', (err) => {
        console.log('MYSQL数据库连接结束:%s', err)
    })
})

const transaction = (sql, values) => {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

const connection = async (sql, values) => {
    try {
        const result = await transaction(sql, values)
        return result
    } catch (err) {
        throw new BizError('数据库操作失败')
    }
}

module.exports = connection