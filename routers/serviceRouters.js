const {addService,getService,updateService,deleteService}=require('../controllers/serviceProfile')
const router=require('express').Router()

router.route('/addservice').post(addService)
router.route('/getservice').get(getService)
router.route('/updservice/:id').put(updateService)
router.route('/deleteservice/:id').delete(deleteService)

module.exports=router;