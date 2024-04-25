const jwt = require('jsonwebtoken')
const Admin = require('../models/admins')
require('dotenv').config()


const adminMiddleWare = async(req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(token){
            const decode = jwt.decode(token, process.env.TOKEN)
            const admin = await Admin.findById(decode?.id)
            if(admin.full_Access == true){
                req.admin = admin
                next()
            }
            
        }
        // res.status(401).json({ message: 'Unathorization!' })
    }catch(err){
        res.status(401).json({ message: err })
    }
}


module.exports = { adminMiddleWare }