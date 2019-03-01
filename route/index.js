const url = require('url')
const assert = require('assert')
const route = require('../lib/route')



route.get('/online',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'})
    res.write('online')
})