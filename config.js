module.exports = {
    host:'0.0.0.0',
    port:'8080',
    mode:'dev',
    db:{
        dialect: 'mysql',
        host : '127.0.0.1',
        database: 'nodejs',
        username: 'root',
        password: 'root',
        operatorsAliases: false,
        timezone : '+08:00',
        logging : false,
        pool:{
            max:5,
            min:0,
            acquire:30000,
            idle:10000
        }
    },
    redis:{
        host: '127.0.0.1',
        port: '6379',
        db: 1
    }
}