const router = require("express").Router()
const {createPurseChatRoom, deleteChat, getPurseChatRoomMembers, addNewPurseMemberToChat, removeUserFromChat} = require("../controller/purseChatRoomController");




// create room for a purse
router.post("/create", createPurseChatRoom)

// delete chat
router.post("/delete", deleteChat)

// add a purse member to the chat of the purse
router.post("/add-member", addNewPurseMemberToChat)

//remove a user from the chat
router.post("/remove", removeUserFromChat)

// get all the members of a room
router.get("/members", getPurseChatRoomMembers)




module.exports = router;