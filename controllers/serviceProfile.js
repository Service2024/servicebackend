require('dotenv').config()
const { where } = require('sequelize')
const serviceDatabase = require('../db/models/servicedetailstable')
const jwt = require('jsonwebtoken')

const addService = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            })
        }

        const decodeID = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decodeID.id)
        if (!decodeID || !decodeID.id) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        const { serviceName, minPrice, maxPrice, serviceDescription, aboutuserDescription, diffServices, qualification } = req.body;

        if (!serviceName, !minPrice, !maxPrice, !serviceDescription, !aboutuserDescription, !diffServices, !qualification) {
            return res.status(400).json({
                message: "fields not included"
            })
        }

        const addserviceInfo = await serviceDatabase.create({
            serviceName,
            minPrice,
            maxPrice,
            serviceDescription,
            aboutuserDescription,
            diffServices,
            qualification,
            user_id: decodeID.id
        })

        if (addserviceInfo) {
            return res.status(200).json({
                message: addserviceInfo
            })
        }
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const getService = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            })
        }

        const decodeID = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decodeID.id)
        if (!decodeID || !decodeID.id) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        const getaddressDetails=await serviceDatabase.findAll({
            where:{user_id:decodeID.id}
        })

        if(getaddressDetails){
            res.status(200).json({
                message:getaddressDetails
            })
        }
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const updateService=async(req,res)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            })
        }

        const decodeID = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decodeID.id)
        if (!decodeID || !decodeID.id) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        const paramid= req.params.id;
        if(!paramid){
            return res.status(400).json({
                message:'parameters not there'
            })
        }

        const{id,...updateservicedetails}=req.body;

        const updateServiceinfo=await serviceDatabase.update(updateservicedetails,{
            where:{id:paramid,user_id:decodeID.id}
        })
        if(updateServiceinfo){
            res.status(200).json({
                message:updateservicedetails
            })
        }
    }catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const deleteService=async(req,res)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            })
        }

        const decodeID = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decodeID.id)
        if (!decodeID || !decodeID.id) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        const serviceparamid=req.params.id;

        const deleteserviceInfo=await serviceDatabase.destroy({
            where:{
                id:serviceparamid,
                user_id:decodeID.id
            }
        })

        if(deleteserviceInfo){
            res.status(200).json({
                message:"Delete Successfully"
            })
        }
    }catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

module.exports = { addService,getService,updateService,deleteService }