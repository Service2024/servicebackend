const {addUserAddress,getUserAddress,updateAddress,deleteAddress,alldetailsuser} = require('../controllers/userAddressapis')
const router=require('express').Router()

router.route('/addaddress').post(addUserAddress)
router.route('/getaddress').get(getUserAddress)
router.route('/updateaddress/:id').put(updateAddress)
router.route('/deletaddress/:id').delete(deleteAddress)
router.route('/alld/:id').get(alldetailsuser)

module.exports=router;