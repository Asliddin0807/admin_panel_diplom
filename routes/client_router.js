const router = require("express").Router();
const {
  regis,
  getUser,
  addToCart,
  deleteFromCart,
  getMyCart,
  purchase,
} = require("../controllers/client_controller");

router.post("/regis", regis);
router.get("/get_user", getUser);
router.post("/add_to_cart", addToCart);
router.delete("/delete_from_cart", deleteFromCart);
router.get("/get_my_cart", getMyCart);
router.post('/purchase', purchase)
module.exports = router;
