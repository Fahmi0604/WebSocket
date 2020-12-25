const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
var fs = require('fs')
const upload = require('express-fileupload');

const wss = new WebSocket.Server({ server:server });

app.use(upload())

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');

  fs.readFile('uploads/readme.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    ws.send(data); 
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
  });
});

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/clients/index.html')
})

app.post('/', (req, res) => {
  if (req.files){
      console.log(req.files)
      var file = req.files.file
      var filename = file.name
      console.log(filename)

      file.mv('./uploads/'+filename, function (err) {
          if (err) {
              res.send(err)
          } else {
              console.log("File Uploaded");
              res.redirect('/');
          }
      })
  }
})

app.get('/server', (req, res) => {
      res.sendFile(__dirname + '/clients/index2.html')
})

server.listen(3000, () => console.log(`Lisening on port :3000`))
