const jwt = require('jsonwebtoken')
require("dotenv").config();

const verifyJwt = async (req, res, next )=>{

    try {
        
        const authHeader = req.headers.Authorization || req.headers.authorization
        
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); //no token: aunauthenticated (401 unauthorised)
 
        const token = authHeader.split(' ')[1]
        
 
             jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) =>{
 
                 if(error) return res.sendStatus(403) // invalid , has autentication tokenn but not valid: 403 Forbidden
                 req.user = decoded.UserInfo.email;
                 req.roles = decoded.UserInfo.roles;
                
                 next();
             }
                 
             )
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
        
    }
   

}

module.exports = {verifyJwt};