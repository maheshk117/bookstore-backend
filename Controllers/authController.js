const userModel = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());



// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    try {
        //console.log(req.body)
        const { email, password } = req.body


    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await userModel.findOne({ email }).exec()
    
    
    
    if (!foundUser) {
        return res.status(401).json({ message: 'User Does not exist' })
    }
    const {roles, _id} = foundUser;
      const id = _id.toString();
     // console.log(id)
    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Invalid username or password' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing  userid and roles 
    res.json({ roles,  accessToken, id })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
        
    }
    
}





// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
 try {
    
    //console.log("hit refersh endpoint")

    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await userModel.findOne({ email: decoded.email }).exec()
                  const {roles, _id} = foundUser;
                  const id = _id.toString();
                  console.log(roles)
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({  accessToken, roles, id })
        }
    )
 } catch (error) {
    console.log(error)
 }
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
   // console.log(req)
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}