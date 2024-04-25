const router = require("express").Router();

const {
  addProduct,
  deleteProduct,
  getProducts,
  updateProd,
  getProductByCateg,
  getProductById
} = require("../controllers/product_controller");
const { adminMiddleWare } = require("../middleware/admin_middleware");

router.post("/add", adminMiddleWare, addProduct);
router.get("/get_product", getProducts);
router.delete("/deleteProduct", adminMiddleWare, deleteProduct);
router.put("/update/:prod_id", adminMiddleWare, updateProd);
router.post('/category', getProductByCateg)
router.post('/product_by_id', getProductById)

module.exports = router;
