const router = require("express").Router();

const {
  regisAdmin,
  login,
  addAdmins,
  deleteAdmin,
  getAdmins,
  getMessageById,
  getMessages,
  getAdmin,
  findFromCode,
  deleteClient,
  deleteMessages
} = require("../controllers/admin_controller");
const { adminMiddleWare } = require("../middleware/admin_middleware");

router.post("/regis_admin", regisAdmin);
router.post("/login", login);
router.post("/add_admin", adminMiddleWare, addAdmins);
router.delete("/delete_admin", adminMiddleWare, deleteAdmin);
router.get("/get_admins", adminMiddleWare, getAdmins);
router.get("/get_messages", adminMiddleWare, getMessages);
router.get("/get_message/:message_id", adminMiddleWare, getMessageById);
router.get("/get_admin", adminMiddleWare, getAdmin);
router.get('/search_code', adminMiddleWare, findFromCode)
router.delete('/delete_user', adminMiddleWare, deleteClient)
router.delete('/delete_message', deleteMessages)


module.exports = router;
