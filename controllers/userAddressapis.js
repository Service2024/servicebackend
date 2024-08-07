const jwt = require('jsonwebtoken')
const AddressDatabase = require('../db/models/address_table')
const UserDatabase = require('../db/models/usertable')

const addUserAddress = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "token not found adding is not possible"
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode.id)

        if (!decode || !decode.id) {
            return res.status(401).json({
                message: "user not found adding is not possible"
            })
        }

        const { address, city, state, postal_code } = req.body;

        if (!address, !city, !state, !postal_code) {
            return res.status(400).json({
                message: 'please fill all fields'
            })
        }

        const createAddress = await AddressDatabase.create({
            address,
            city,
            state,
            postal_code,
            user_id: decode.id
        })

        if (createAddress) {
            res.status(200).json({
                message: "Adding address success"
            })
        } else {
            res.status(500).json({
                message: 'Failed to add address.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const getUserAddress = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "token not found adding is not possible"
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (!decode || !decode.id) {
            return res.status(401).json({
                message: "user not found adding is not possible"
            })
        }

        const getDetails = await AddressDatabase.findAll({
            where: { user_id: decode.id }
        })

        res.status(200).json({
            message: getDetails
        })
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}


const updateAddress = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: "token not found adding is not possible"
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (!decode || !decode.id) {
            return res.status(401).json({
                message: "user not found adding is not possible"
            })
        }

        const { address, city, state, postal_code } = req.body;
        const addressId = req.params.id;
        const upAddress = {}
        if (address) upAddress.address = address;
        if (city) upAddress.city = city;
        if (state) upAddress.state = state;
        if (postal_code) upAddress.postal_code = postal_code;

        const [updaAddrss] = await AddressDatabase.update(upAddress, {
            where: {
                id: addressId,
                user_id: decode.id
            }
        })
        if (updaAddrss === 0) {
            return res.status(404).json({
                message: "Address not found or not authorized to update."
            });
        }

        res.status(200).json({
            message: "Address updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const deleteAddress = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "token not found adding is not possible"
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (!decode || !decode.id) {
            return res.status(401).json({
                message: "user not found adding is not possible"
            })
        }
        const addressId = req.params.id;
        if (!addressId) {
            return res.status(400).json({
                message: "Address ID is required."
            });
        }
        const delAddress = await AddressDatabase.destroy({
            where: {
                id: addressId,
                user_id: decode.id
            }
        })
        if (delAddress === 0) {
            return res.status(404).json({
                message: "Address not found or not authorized to update."
            });
        }

        res.status(200).json({
            message: "Address Deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

const alldetailsuser=async(req,res)=>{
    try{
        getparamId=req.params.id;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "token not found adding is not possible"
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (!decode || !decode.id) {
            return res.status(401).json({
                message: "user not found adding is not possible"
            })
        }
        if (!getparamId) {
            return res.status(400).json({
                message: "Address ID is required."
            });
        }

        const getUser=await UserDatabase.findOne({
            where:{id:getparamId}
        })
        const getaddress=await AddressDatabase.findAll({
            where:{user_id:getparamId}
        })

        res.status(200).json({
            getUser,
            getaddress
        })
    }catch (error) {
        res.status(500).json({
            message: `${error}`
        })
    }
}

module.exports = { addUserAddress, getUserAddress, updateAddress, deleteAddress, alldetailsuser}