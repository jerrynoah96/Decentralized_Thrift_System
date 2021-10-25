const router = require("express").Router();
const {getOrCreateUser, deleteUser} = require("../controller/userController");



router.post("/get-or-create", getOrCreateUser);

router.post("/delete", deleteUser);

module.exports = router;