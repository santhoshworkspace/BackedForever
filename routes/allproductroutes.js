import express from 'express'
import {Postallproduct,
    categories,getallproduct,
    getproductbyid,addcartproduct,getcartproduct,
    placeoder,getplacedorder,increaseCartItemQuantity,decreaseCartItemQuantity,
    getProductByCategorySorted
} from '../controllers/Productcontrollers.js'
const router = express.Router()

router.post('/postallproducts',Postallproduct)
router.get('/getcategories/:category',categories)
router.get('/getallproduct',getallproduct)
router.get('/getproductbyid/:id',getproductbyid)
router.post('/CardItems/:id',addcartproduct)
router.get('/getcartproduct',getcartproduct)
router.post('/placeoder/:id',placeoder)
router.get('/getplacedorder',getplacedorder)
router.put('/cart/increase/:id', increaseCartItemQuantity);
router.put('/cart/decrease/:id', decreaseCartItemQuantity);
router.get('/shortproduct/:category/sorted',getProductByCategorySorted)
export default router