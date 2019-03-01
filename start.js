const cluster = require('cluster')
const http = require('http')
const os = require('os')

module.exports = function (dispatch, host, port) {
    if (cluster.isMaster){
        let numWorkers = os.cpus().length
        console.log('master cluster setting up '+ numWorkers+'workers...')
        for(let i = 0; i < numWorkers ; i ++){
            cluster.fork()
        }
        cluster.on('online',function (worker) {
            console.log('worker' + worker.process.pid +'is online')
        })
        cluster.on('exit',function (worker, code, signal) {
            console.log('worker'+ worker.process.pid+'died with code '+code+'and signal '+signal);
            console.log('starting a new worker')
            cluster.fork()
        })
    }else{
        http.createServer(dispatch).listen(port,host,()=>{
            console.log('process '+ process.pid + ` is listening in ${host}:${port} for incoming requests`)
        })
    }
}