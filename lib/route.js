const url = require('url')

const route = {
    basePath: '',
    globalMiddleware: [],
    groupStack: [],
    routes :[]
}

route.use = (...middleware)=>{
    for(let m of middleware){
        if (this.globalMiddleware.indexOf(m) === -1 && typeof(m) == 'function'){
            this.globalMiddleware.push(m)
        }
    }
}

route.group = (prefix,callback,...middleware)=>{
    this.groupStack.push({prefix:prefix,middleware:middleware})
    callback()
    this.groupStack.pop()
}
route.get = (uri,handler,...middleware)=>{
    route.addRoute(uri,['get'],handler,...middleware)
}
route.post = (uri,handler,...middleware) =>{
    route.addRoute(uri,['post'],handler,...middleware)
}

route.addRoute = (uri,methods,handler,...middlewares)=>{
    for(let i = this.groupStack.length - 1 ; i >=0 ; i ++){
        let groupItem = this.groupStack[i]
        uri = groupItem.prefix +  uri
        middlewares = groupItem.middleware.concat(middlewares)
    }
    middlewares = this.globalMiddleware.concat(middlewares)
    if (this.basePath){
        uri = this.basePath + url
    }
    let callback = pipeline(middlewares,handler)
    this.routes[uri] = {methods:methods,callback,callback}
}



route.dispatch = (req,res) =>{
    const method = req.method.toLowerCase()
    const uri = url.parse(req.url,true).pathname
    let  r = route.routes[uri]
    if (r == undefined || r == null){
        res.writeHead(404,{'Content-Type':'text/plain'})
        res.write(`${uri} not found`)
        res.end()
        return
    }
    if (!r.method.includes(method)){
        res.writeHead(405,{'Content-Type':'text/plain'})
        res.write(`${uri} with method ${method} not allowed`)
        res.end()
        return
    }
    r.callback(req,res)
}
//实现中间件
function pipeline(middleware, dispatch) {
    middleware = middleware.reverse()
    return middleware.reduce(function (pre, curr) {
        return function (req, res) {
            curr(req,res,pre)
        }
    },dispatch)
}


module.exports = route

