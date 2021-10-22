const router = require("express").Router()
const {createPurseChatRoom, getPurseChatRoomMembers, addNewPurseMemberToChat} = require("../controller/purseChatRoomController");




// create room for a purse
router.post("/create", createPurseChatRoom)

// add a purse member to the chat of the purse
router.post("/add-member", addNewPurseMemberToChat)

// get all the members of a room
router.get("/members", getPurseChatRoomMembers)




module.exports = router;