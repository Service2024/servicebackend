const {orderPost,userOrderDetails,workerOrderDetails,updateOrderDetails}=require('../controllers/orderConrollers')
const { authenticateToken } = require('../middleware/authToken')
const router=require('express').Router()

router.route('/orderpost').post(authenticateToken,orderPost)
router.route('/userorders').get(authenticateToken,userOrderDetails)
router.route('/workorders').get(authenticateToken,workerOrderDetails)
router.route('/updateOrders/:id').put(authenticateToken,updateOrderDetails)

module.exports=router