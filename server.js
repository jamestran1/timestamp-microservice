// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/timestamp/:date_string?', (req, res) => {
  console.log(req.params);
  var date;
  if(req.params.date_string == "" || !req.params.date_string) {
    date = new Date();
  }
  else {
    var date = new Date(req.params.date_string);
    
    var timestamp = parseInt(req.params.date_string*1);
    
    if(!isNaN(timestamp)) {
      date = new Date(timestamp);
    }
    else {
      date = new Date(req.params.date_string)
    }
  }
  
  var error = {error:"Invalid Date"};
  
  res.json(date == "Invalid Date" ? error: {
      "unix": date.getTime(),
      "utc": date.toUTCString()
    })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
