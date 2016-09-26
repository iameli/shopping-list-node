var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var jsonParser = bodyParser.json();


var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },

  delete: function(id) {
    this.items.splice(this.getIndex(id), 1);
  },

  update: function(id, name) {
    this.items[this.getIndex(id)].name = name;
  },

  getIndex: function(id) {
    var itemIds = this.items.map(function(item) {
      return item.id;
    });
    return itemIds.indexOf(id);
  }
};


var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 0;
  return storage;
};


var storage = createStorage();


storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');


var responseDeletePut = function(request, response) {
  var itemId  = parseInt((request.params.id), 10);

  var indexOfItem = storage.getIndex(itemId);

  if(isNaN(itemId)) {

    response.status(400).send();

  } else if (indexOfItem > -1) {

    switch (request.method) {
      case 'DELETE' :
        storage.delete(itemId);
        break;

      case 'PUT' :
        if (!('name' in request.body)) {
          return response.sendStatus(400);
        }

        storage.update(itemId, request.body.name);
        break;
    }

    response.status(200).send('Update made.');

  } else {

    switch (request.method) {
      case 'PUT' :
        var itemVal = (request.body.name) ? request.body.name : 'New item';
        var item    = storage.add(itemVal);
        response.status(201).json(item);
        break;

      case 'DELETE' :
        response.status(404).end('Your request cannot be found.');
        break;
    }
  }
};


var app = express();

app.use(morgan('combined'));
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
