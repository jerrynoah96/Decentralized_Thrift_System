axios = require('axios');



exports.getOrCreateUser = async (req, res) => {

    if(!req.body.username) return res.status(401).json("incomplete data")

    const requestConfig = {
        method: 'put',
        url: 'https://api.chatengine.io/users/',
        headers: {
        'PRIVATE-KEY': process.env.CHATENGINE_PRIVATE_KEY
        },
        data : {
            "username": req.body.username,
            "secret": req.body.username
        }
    };

    axios(requestConfig)
    .then(response => {
        res.status(200).json(response.data)
    })
    .catch(error => {
        res.status(500).json(error)
    });

}

exports.deleteUser = async (req, res) => {


}
