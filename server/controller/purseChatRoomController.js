axios = require('axios');
const request = require('request');

exports.createPurseChatRoom = async (req, res) => {
    const {walletId, chat_title} = req.body
    
    if(!walletId || !chat_title) return res.status(401).json("incomplete data")

    const requestConfig = {
        method: 'post',
        url: 'https://api.chatengine.io/chats/',
        headers: {
            'Project-ID': process.env.CHATENGINE_PROJECT_ID,
            'User-Name': walletId,
            'User-Secret': walletId
        },
        data: {
            "title": chat_title,
            "is_direct_chat": false
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


exports.deleteChat = async (req, res) => {

    const {chat_id, adminUsername} = req.body;

    const options = {
        'method': 'DELETE',
        'url': `https://api.chatengine.io/chats/${chat_id}/`,
        'headers': {
            'Project-ID': process.env.CHATENGINE_PROJECT_ID,
            'User-Name': adminUsername,
            'User-Secret': adminUsername
        },
        json: true
    };

    request(options, function(error, response) {
        if (error) res.status(500).json(error);
        
        console.log(response.body)
        res.status(200).json(response.body)
    });
}

exports.addNewPurseMemberToChat = async (req, res) => {

    const {chat_id, username, adminUsername} = req.body

    if(!chat_id || !username || !adminUsername) return res.status(401).json("incomplete data")

    var options = {
        'method': 'POST',
        'url': `https://api.chatengine.io/chats/${chat_id}/people/`,
        'headers': {
            'Project-ID': process.env.CHATENGINE_PROJECT_ID,
            'User-Name': adminUsername,
            'User-Secret': adminUsername
        },
        body: {
            "username": username
        },
        json: true
        
        };
        request(options, function(error, response) {
        if (error) res.status(500).json(error);
        console.log(response.body)
        res.status(200).json(response.body)
    });

}

exports.removeUserFromChat = async (req, res) => {

    const {chat_id, username, adminUsername} = req.body;

    if(!chat_id || !username || !adminUsername) return res.status(401).json("incomplete data")

    const options = {
        'method': 'PUT',
        'url': `https://api.chatengine.io/chats/${chat_id}/people/`,
        'headers': {
            'Project-ID': process.env.CHATENGINE_PROJECT_ID,
            'User-Name': adminUsername,
            'User-Secret': adminUsername
        },
        body: {
            "username": username
        },
        json: true
    };

    request(options, function(error, response) {
        if (error) res.status(500).json(error);
        
        res.status(200).json(response.body)
    });
}

exports.getPurseChatRoomMembers = async (req, res) => {

}