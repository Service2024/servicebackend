const bcrypt = require('bcrypt')
const UserDatabase = require('../db/models/usertable')
const salt = 15
const jwt = require('jsonwebtoken')

const Signup = async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, password, usertype } = req.body;

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
            usertype: usertype || '0'
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
            token:token
        })

    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}


const Forgotpassword= async(req,res)=>{
    try{
        const{email}=req.body;
        const checkuser= await UserDatabase.findOne({
            where:{email}
        })
        if(!checkuser){
            return res.json(
                {
                    message:"Email not found"
                }
            )
        }else{
            const createUpdatetoken= await jwt.sign({id:checkuser.id},process.env.SECRET_KEY,{expiresIn:'5m'})
            await checkuser.update({ updatetoken:createUpdatetoken },{id:checkuser.id})
            return res.json(
                {
                    message:createUpdatetoken
                }
            )
            
        }
    }catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const Updatepassword=async(req,res)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(404).json({
                message:'Token not found or Expired'
            })
        }
        
        const decode=jwt.verify(token,process.env.SECRET_KEY);

        if(!decode||!decode.id){
            return res.status(404).json({
                message:'User not found'
            })
        }

        const {password}=req.body;
        const update_password={}
        if(password) update_password.password=await bcrypt.hash(password,salt);
        const updateUserpassword= await UserDatabase.update(update_password,{
            where:{id:decode.id}
        })

        res.status(200).json({
            message:"password updated sucessfully"
        })

    }catch (error) {
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

const UpdateProfile = async (req,res)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1]
        if(!token){
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
        const {firstname,lastname,email,phonenumber,password}=req.body;
        if(!firstname,!lastname,!email,!phonenumber,!password){
            return res.json({
                message: "Please fill all fields"
            })
        }

        const update_values={}
        if(firstname) update_values.firstname=firstname
        if(lastname) update_values.lastname=lastname
        if(email) update_values.email=email
        if(phonenumber) update_values.phonenumber=phonenumber
        if(password) update_values.password=await bcrypt.hash(password,salt)

        const[rowupdates]=await UserDatabase.update(update_values,{where:{id:decode.id}})
        if(!rowupdates){
            return res.json({
                message: "PRoblem in update "
            })
        }

        res.status(200).json({
            message:"Sucessfully updated"
        })
    }
    catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

module.exports = { Signup, Login, Profile,UpdateProfile,Forgotpassword,Updatepassword }