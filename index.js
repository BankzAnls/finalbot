var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var token = 'EAAIwxSzOriIBAKCK0l4wB8vMgfLuC9gChxW6PVhco3UM1ZAGAzpWmI48x3AveOjrUdN5IhZChE6ythZAMnesrswUcmzQugZCqoNk14oZCyzpOW7g6EwLko2LgomZCsAPZCzSlqMHZARZAUrKlckWW4YE7sC4RZCeR8qWnlcOQnZApe9UQZDZD'
var app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('test')
})
function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'checkbot') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log(text, sender)
      var Textar = text.split(' ')
      if (Textar[0] === 'sum') {
        var sum = parseInt(Textar[1]) + parseInt(Textar[2])
        sendTextMessage(sender, sum + '')
      } else if (Textar[0] === 'max') {
        if (parseInt(Textar[1]) > parseInt(Textar[2])) {
          sendTextMessage(sender, Textar[1])
        } else {
          sendTextMessage(sender, Textar[2])
        }
      } else if (Textar[0] === 'min') {
        if (parseInt(Textar[1]) < parseInt(Textar[2])) {
          sendTextMessage(sender, Textar[1])
        } else {
          sendTextMessage(sender, Textar[2])
        }
      } else if (Textar[0] === 'avg') {
        var avgSum = 0
        for (var b = 1; b < arrText.length; b++) {
          avgSum = avgSum + parseInt(Textar[b])
        }
        var avg = avgSum / (arrText.length - 1)
        sendTextMessage(sender, avg)
      }
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example aoo listening on port ' + app.get('port') + ' !')
})
