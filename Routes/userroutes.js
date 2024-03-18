const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const {verifyJwt} = require('../Middlewares/verifyJWT')
const {verifyRoles} = require('../Middlewares/verifyRoles')
const ROLES_LIST = require("../Config/rolesList")
const {signUp, getSingleUser, getAllUsers, deleteUser, editUser } = require("../Controllers/userController")



router.post('/signUp',  signUp )
router.get('/:id',verifyJwt, verifyRoles(ROLES_LIST.Cust, ROLES_LIST.Admin), getSingleUser )
router.get('/',verifyJwt, verifyRoles(ROLES_LIST.Admin), getAllUsers )
router.delete('/delete/:id',verifyJwt, verifyRoles(ROLES_LIST.Admin), deleteUser )
router.put('/edit/:id',verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Cust), editUser )














module.exports = router;