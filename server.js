'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 4567;
const router = express.Router();
var analyzer = require('./lib/chatanalyzer')
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const CLIENT_ID = '323105054656.323954295283';
const CLIENT_SECRET='ccd2a9149a30efe7bbc31e79cf4cbbb0';


var an = analyzer.chatanalyzer();
//console.log(an)
// start server
app.listen(port, function (req, res) {
    console.info(`Started Express server on port ${port}`)
});

app.get('/auth',function(req, res, next){
    console.log('get')
    console.log(req.body);
    console.log(req.query.code);
    
    var code = req.query.code;
    var state = req.query.state;

    var options = {
        'url': 'https://slack.com/api/oauth.access',
        'qs':{
            'code':code,
            'client_id':CLIENT_ID,
            'client_secret':CLIENT_SECRET

        },
        'method': 'GET',
        'headers': {
            'content-type': 'application/x-www-form-urlencoded'
        }
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(body);
        res.send("Thanks..")
    }
    request(options, callback); 
});



app.get('/', function(req, res, nxt){
    res.sendFile(path.join(__dirname+'/index.html'));
});


app.post('/command', function(req, res, nxt){
    var command = req.body.command;
    if(command && command.toUpperCase() === '/TCI-HELP'){
        sendReplyOfCommand_help(req.body);
    }else if(command && command.toUpperCase() === '/TCI-NEWS'){
        sendReplyOfCommand_news(req.body);
    }
   
   // res.status(200).jsonp({"text":'@'+req.body.user_name+' Thanks for your intstructions, I am working over your command'});
    res.status(200).send();
});


app.post('/events', function (req, res, nxt) {
    if(req.body && req.body.challenge){
        res.status(200).send(req.body.challenge);
    }else if(req.body && req.body.event.type === 'app_mention'){
        console.log('------------------- APP MENTION --------------------------------');
        sendReply(req.body);
    }
    else if(req.body && req.body.event.type === 'message' && req.body.event.username !== 'testbotservice'){
        console.log('------------------- DIRECT BOT --------------------------------');
        sendReply(req.body);
    }
    console.log("Replied !!!");
    res.status(200).send();

});


var sendReply = function (recievedData) {
    console.log(recievedData);
    var event = recievedData.event;
    var chattext = event.text.toUpperCase();
    console.log(chattext);
    an.setSentense(chattext)
    // console.log(an.getSentiment());
    // console.log(an.getPossibleReply()); 
    var respMsg = {
        'channel': event.channel,
        'text': an.getPossibleReply()
    }


    var options = {
        'url': 'https://slack.com/api/chat.postMessage',
        'method': 'POST',
        'headers': {
            'content-type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer xoxb-323954774065-BTZInwHGJoqyDR21opFxqCkM'
        },
        'body': JSON.stringify(respMsg)
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(body);
    }

    request(options, callback); 
    return;
}



function sendReplyOfCommand_help(commandData){
    console.log(commandData)
    var responseUrl = commandData.response_url;
    var respMsg = {
        "response_type": "in_channel",
        "text": "Thanks for using TCI commands",
        "attachments": [
            {
                    "title":"TIBCO Cloud Integration : HELP & Docs",
                    "title_link":"https://www.tibco.com/products/cloud-integration",
                    "text": "TCI : How to..",
                    "color": "#FF0000",
                    "image_url":"https://www.tibco.com/blog/wp-content/uploads/2015/08/tibco-logo-620x360.jpg"
         
            }
        ]
    }

    var options = {
        'url': responseUrl,
        'method': 'POST',
        'headers': {
            'content-type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer xoxb-323954774065-BTZInwHGJoqyDR21opFxqCkM'
        },
        'body': JSON.stringify(respMsg)
    };

    console.log(options);

    function callback(error, response, body) {
        console.log(error);
        console.log(body);
    }

    request(options, callback); 
    return;
}


function sendReplyOfCommand_news(commandData){
    console.log(commandData)
    var responseUrl = commandData.response_url;
    var respMsg = {
        "response_type": "in_channel",
        "text": "Thanks for using TCI commands",
        "attachments": [
            {
                "title":"TIBCO Cloud Integration : NEWS",
                "title_link":"https://www.tibco.com/products/cloud-integration",
                "text": "Latest from TCI",
                "color": "#7CD197",
                "image_url":"https://www.tibco.com/blog/wp-content/uploads/2015/08/tibco-logo-620x360.jpg"
            }
        ]
    }

    var options = {
        'url': responseUrl,
        'method': 'POST',
        'headers': {
            'content-type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer xoxb-323954774065-BTZInwHGJoqyDR21opFxqCkM'
        },
        'body': JSON.stringify(respMsg)
    };

    console.log(options);

    function callback(error, response, body) {
        console.log(error);
        console.log(body);
    }

    request(options, callback); 
    return;
}