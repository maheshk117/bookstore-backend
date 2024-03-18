const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const {login , refresh, logout } = require('../Controllers/authController')


router.post( '/', login)

router.get('/refresh', refresh)

router.post( '/logout', logout)

module.exports = router