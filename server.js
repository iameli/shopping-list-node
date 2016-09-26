var express    = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  }
};


var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};


var storage = createStorage();


storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');


var responseDeletePut = function(request, response) {
  var itemId  = parseInt((request.params.id), 10);

  var itemIds = storage.items.map(function(item) {
    return item.id;
  });

  if(isNaN(itemId)) {

    response.status(400).send();

  } else if (itemIds.indexOf(itemId) > -1) {

    response.status(200).send('Update made.');

  } else {

    switch (request.method) {
      case 'PUT' :
        var itemVal = (request.body.name) ? request.body.name : 'New item';
        var item    = storage.add(itemVal);
        response.status(201).json(item);
        break;

      case 'DELETE' :
        response.status(404).send('Your request cannot be found.');
        break;
    }
  }
};


var app = express();
app.use(express.static('public'));


app.get('/items', function(request, response) {
  response.json(storage.items);
});


app.post('/items', jsonParser, function(request, response) {
  if (!('name' in request.body)) {
    return response.sendStatus(400);
  }

  var item = storage.add(request.body.name);
  response.status(201).json(item);
});


app.delete('/items/:id', jsonParser, function(request, response) {
  responseDeletePut(request, response);
});


app.put('/items/:id', jsonParser, function(request, response) {
  responseDeletePut(request, response);
});


app.listen(process.env.PORT || 8080, process.env.IP);
