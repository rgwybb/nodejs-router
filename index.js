const http = require('http')
const config =require('./config')
const start = require('./start')

if (config.mode == "dev"){
    http.createServer()
}else{
    start(nill,config.host,config.port)
}