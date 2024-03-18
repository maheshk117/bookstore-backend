const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const {verifyJwt} = require('../Middlewares/verifyJWT')
const {verifyRoles} = require('../Middlewares/verifyRoles')
const {rentBook} = require('../Controllers/rentController')
const ROLES_LIST = require("../Config/rolesList")



router.post('/',verifyJwt,verifyRoles(ROLES_LIST.Cust), rentBook);






module.exports= router