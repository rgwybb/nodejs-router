const url = require('url');

let route = {
    basePath: "",
    globalMiddlewares:[],
    groupStack: [],
    routes: [],
};
this.globalMiddlewares = [];
this.groupStack = [];
this.routes = [];

route.use = (...middlewares)=> {
    for (let m of middlewares) {
        if (this.globalMiddlewares.indexOf(m) === -1 && typeof (m) === "function") {
            this.globalMiddlewares.push(m)
        }
    }
};

route.group = (prefix, callback, ...middlewares)=> {
    this.groupStack.push({ prefix: prefix, middlewares: middlewares });
    callback()
    route.groupStack.pop()
}

route.get = (uri, handler, ...middleware)=> {
    route.addRoute(uri, ['get'], handler, ...middleware)
}

route.post = (uri, handler, ...middleware)=> {
    route.addRoute(uri, ['post'], handler, ...middleware)
}

route.addRoute = (uri, methods, handler, ...middlewares)=> {
    for (let i = this.groupStack.length - 1; i >= 0; i--) {
        let groupItem = this.groupStack[i]
        uri = groupItem.prefix + uri
        middlewares = groupItem.middlewares.concat(middlewares)
    }
    middlewares = this.globalMiddlewares.concat(middlewares)
    if (route.basePath) {
        uri = route.basePath + uri
    }
    let callback = pipeline(middlewares, handler)
    route.routes[uri] = { methods: methods, callback: callback }
}

route.dispatch =  (req, res)=> {
    const method = req.method.toLowerCase()
    const uri = url.parse(req.url, true).pathname
    let r = route.routes[uri]
    if (r == undefined || r == null) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write(`${uri} not found`)
        res.end()
        return
    }
    if (!r.methods.includes(method)) {
        res.writeHead(405, { 'Content-Type': 'text/plain' })
        res.write(`${uri} with method ${method} not allowed`)
        res.end()
        return
    }
    r.callback(req, res)
}

// 中间件实现
function pipeline(middleware, dispatch) {
    middleware = middleware.reverse()
    return middleware.reduce(function (pre, curr) {
        return function (req, res) {
            curr(req, res, pre)
        }
    }, dispatch)
}

module.exports = route