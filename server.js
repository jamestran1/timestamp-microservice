// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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
});

app.get('/api/whoami', (req, res) => {
  res.json({
    "ipaddress": req.header('x-forwarded-for').split(',')[0],
    "language": req.header('Accept-Language'),
    "software": req.header('User-Agent')
  });
});

var shorternUrls = [];
var count = 1;

app.post('/api/shorurl/new', (req, res) => {
  var url = req.body.url.substring(8, req.body.url.length);
  
  dns.lookup(url, (err, address, family) => {
    if (err) res.json({"error": "invalid URL"});
    
    for (var i=0; i< shorternUrls.length; i++) {
      if (shorternUrls[i].original_url == url) {
        res.json(shorternUrls[i]);
      }
    }
    
    var shortUrl = {
      "original_url": url,
      "short_url": count
    };
    shorternUrls.push(shortUrl);
    count++;
    console.log(shorternUrls);
    res.json(shortUrl);
  })
  
});

app.get('/api/shorurl/new/:short', (req, res) => {
  shorternUrls.forEach((d) => {
      if (d.short_url == req.params.short) {
        res.redirect("https://"+d.original_url);
      }
    });
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
