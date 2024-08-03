const bcrypt = require('bcrypt')
const UserDatabase = require('../db/models/user_table')
const salt = 15
const jwt = require('jsonwebtoken')

const Signup = async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, password, userType } = req.body;

        if (!firstname, !lastname, !email, !phonenumber, !password) {
            return res.json({
                message: "Please fill all fields"
            })
        }

        const bcrypt_password = await bcrypt.hash(password, salt)

        const newUser = await UserDatabase.create({
            firstname,
            lastname,
            email,
            phonenumber,
            password: bcrypt_password,
            userType: userType || '0'
        })

        if (newUser) {
            res.status(200).json({
                message: 'success'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email, !password) {
            return res.json({
                message: "Please fill all fields"
            })
        }

        checkUser = await UserDatabase.findOne({
            where: { email }
        })

        if (!checkUser) {
            return res.status(401).json({
                message: "Email or password wrong"
            })
        }

        encryptPAssword = await bcrypt.compare(password, checkUser.password)

        if (!encryptPAssword) {
            return res.status(401).json({
                message: "Email or password wrong"
            })
        }

        const token = await jwt.sign({ id: checkUser.id }, process.env.SECRET_KEY, ({ expiresIn: '1h' }))
        await checkUser.update({ token })

        res.status(200).json({
            message: 'success',
            details:token
        })

    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const Profile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            {
                return res.json({
                    message: "There is no token"
                })
            }
        }

        const decode=jwt.verify(token,process.env.SECRET_KEY)

        if(!decode||!decode.id){
            {
                return res.json({
                    message: "token invalid"
                })
            }
        }

        const getDetails=await UserDatabase.findOne({
            where:{id:decode.id}
        })
        
        res.status(200).json({
            message:getDetails
        })
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}
module.exports = { Signup, Login, Profile }