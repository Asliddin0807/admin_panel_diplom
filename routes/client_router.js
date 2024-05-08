const router = require("express").Router();
const {
  regis,
  getUser,
  addToCart,
  deleteFromCart,
  getMyCart,
  purchase,
  getCategorys,
  searchProduct,
} = require("../controllers/client_controller");

router.post("/regis", regis);
router.post("/get_user", getUser);
router.post("/add_to_cart", addToCart);
router.post("/delete_from_cart", deleteFromCart);
router.post("/get_my_cart", getMyCart);
router.post("/purchase", purchase);
router.get("/get_category", getCategorys);
router.post('/search', searchProduct)

module.exports = router;
