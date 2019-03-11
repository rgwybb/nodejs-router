const url = require('url')
const assert = require('assert')
const route = require('../lib/route')
const middleware = require('./middleware')

route.use(middleware.err)

route.get('/online',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'})
    res.write('online')
})


module.exports = route