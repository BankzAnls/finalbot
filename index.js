var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var token = "EAAIwxSzOriIBACzvs1SsEZCq0tFmXHSDTs3smxARByXtVakr9MJ0rRuQ2RZAkxv8rO79CIcZCs0Kbds7ywTqsMkLQjXZAMT7ppDKcXbzc9P9ZCFpBaPcvN9TsXH8x274f5c5pM3IuxGZCcZCVnAKP36rtcnGC5Ykgdyg1EzVZAjNiAZDZD";
function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
app.use(bodyParser.json())

app.get('/',function(req,res){
  res.send('Hello World');
})
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'checkbot') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log(text, sender)
      var arrText = text.split(' ')
      if (arrText[0] === 'sum') {
        var sum = parseInt(arrText[1]) + parseInt(arrText[2])
        sendTextMessage(sender, sum + '')
      } else if (arrText[0] === 'max') {
        if (parseInt(arrText[1]) > parseInt(arrText[2])) {
          sendTextMessage(sender, arrText[1])
        } else {
          sendTextMessage(sender, arrText[2])
        }
      } else if (arrText[0] === 'min') {
        if (parseInt(arrText[1]) < parseInt(arrText[2])) {
          sendTextMessage(sender, arrText[1])
        } else {
          sendTextMessage(sender, arrText[2])
        }
      } else if (arrText[0] === 'avg') {
        var avgSum = 0
        for (var b = 1; b < arrText.length; b++) {
          avgSum = avgSum + parseInt(arrText[b])
        }
        var avg = avgSum / (arrText.length - 1)
        sendTextMessage(sender, avg)
      }
    }
  }
  res.sendStatus(200);
});

app.set('port',(process.env.PORT || 5000))
app.listen(app.get('port'),function(){
  console.log('Example app listening on port'+ app.get('port'))
})
