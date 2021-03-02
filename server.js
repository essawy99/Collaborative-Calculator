// server.js
// where your node app starts

// load up express and filesystem
const express = require("express");
const app = express();
const fs = require("fs");

// lets server send over index.html and friends
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// stores calculation data in an array
storage = []

// opens file that stores calculations for persistance
fs.open('dataStorage.txt', 'r+', function(err, fd) {
  if (err) {
     return console.error(err);
  }
  console.log("File opened successfully!");     
});

// reads data from dataStprage and loads it into storage array
fs.readFile('dataStorage.txt', function (err, data) {
  if (err) {
     return console.error(err);
  }
  storage = JSON.parse(data.toString());

});

// helper function for sorting by time created
function compare(a, b) {
  if(a.time > b.time) {
    return -1;
  }
  else {
    return 1;
  }
}

// sort storage 
storage.sort(compare);


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// make all the files in 'public' available
app.use(express.static("public"));
app.use(express.json({limit: '1mb'}))


// allow client to get calculations when needed
app.get('/getCalculations', (request, response) => {
  response.send(JSON.stringify(storage))
});

//allows client to clear data storage if they want
app.get('/clearData', (request, response) => {
  
  // sets storage to an empty array
  storage = [];

  // update file
  fs.writeFile('dataStorage.txt', JSON.stringify(storage), function(err) {
    if (err) {
       return console.error(err);
    }   
  });
  
  // sned new storage back
  response.send(JSON.stringify(storage));

});

app.post('/sendCalculations', (request, response) => {
  // add new calculation to storage
  storage.push(request.body);
  // sort it just in case
  storage.sort(compare);
  
  // if storage is too big pop off oldest calculation
  if(storage.length > 10) {
    storage.pop();
  }
  console.log(storage);

  // send back new storage
  response.send(JSON.stringify(storage))
  
  // write new storage to filesystem
  fs.writeFile('dataStorage.txt', JSON.stringify(storage), function(err) {
    if (err) {
       return console.error(err);
    }
    
 });
});