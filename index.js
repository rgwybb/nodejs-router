const http = require('http')
const config =require('./config')
const start = require('./start')
const route = require('./route')

if (config.mode === "dev"){
    http.createServer(route.dispatch).listen(config.port,config.host,()=>{
        console.log('Process: ['+process.pid+ `]is listening in ${config.host}:${config.port} for incoming requests`)
    })
}else{
    start(route.dispatch,config.host,config.port)
}