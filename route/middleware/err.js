
module.exports  = function (req, res, next) {
    try{
        next(req,res)
    } catch (err){
        console.log(req,err)
    }
}