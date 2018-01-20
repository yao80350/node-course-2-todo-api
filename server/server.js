const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();

// 先在bash上运行node server.js 有端口被req时  就会触发app.use()
// 有localhost:3000/todos被req时  就会触发app.post('/todos', () => {});
app.use(bodyParser.json());  //JSON 转成 obj

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/12343242
app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//event监听3000端口有没有被req
app.listen(3000, () => {
  console.log('Started on port 3000');
})

module.exports = {app};
