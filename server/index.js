if(process.env.NODE_ENV !== "production") require('dotenv').config()
const express = require("express");
const userRoute = require("./routes/user");
const purseChatRoomRoute = require("./routes/purseChatRoom");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());



// for testing purpose only
app.get("/", (req, res) => {
    res.status(200).json("hello from thrift server")
})

app.use("/api/user", userRoute);

app.use("/api/chat", purseChatRoomRoute);


const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 8000;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})