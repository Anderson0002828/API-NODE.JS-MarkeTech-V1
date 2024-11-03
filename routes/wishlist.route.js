const express = require('express');
const router = express.Router();
const wishListController = require('../controllers/wishlist.controller');

router.post('/addWishList', wishListController.addToWishList);
router.get('/getWishListItems', wishListController.getWishListItems);
router.delete('/deleteWishListItem/:wishlistItemId', wishListController.deleteWishListItem);

module.exports = router;