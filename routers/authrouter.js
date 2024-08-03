const { Signup, Login, Profile } = require('../controllers/authControllers')

const router=require('express').Router()

router.route('/signup').post(Signup)
router.route('/login').post(Login)
router.route('/profile').get(Profile)


module.exports = router