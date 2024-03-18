const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const {verifyJwt} = require('../Middlewares/verifyJWT')
const {verifyRoles} = require('../Middlewares/verifyRoles')
const ROLES_LIST = require("../Config/rolesList")
const {addBookReview, getBookReview} = require('../Controllers/reviewController')

verifyJwt, verifyRoles(ROLES_LIST.Cust)

router.post('/add/:id', verifyJwt, verifyRoles(ROLES_LIST.Cust), addBookReview)
router.get('/view/:id',verifyJwt, verifyRoles(ROLES_LIST.Cust, ROLES_LIST.Admin), getBookReview)






module.exports = router;