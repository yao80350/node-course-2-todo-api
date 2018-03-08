require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;

// 先在bash上运行node server.js 有端口被req时  就会触发app.use()
// 有localhost:3000/todos被req时  就会触发app.post('/todos', () => {});
app.use(bodyParser.json());  //JSON 转成 obj

app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/12343242
app.get('/todos/:id', authenticate, (req, res) => {
  // res.send(req.params);
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    // 加入_creator，更安全： 查看的话，需要满足 _id, _creator
    // 1. 没有登入就没有token --- call cuthenticate失败，就没有_creator
    // 2. 创建todo时同时加入user的id到_creator，登入用户用他人_id查看，数据库里的二者不同时匹配，找不到。
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  // _.pick() 从req.body内挑选 ['property'] ---这样加入的body只允许加选中的property
  let body = _.pick(req.body, ['text', 'completed']); //req.body是送过来的值

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) { //改动completed === false时 去掉原先加的时间
    body.completedAt = new Date().getTime(); //completed === true时 加入改动时间 1970-现在的毫秒数
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // {$set: {}} --- 更改  //{new: true} --- 返回更改后的值
  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

// 请求'/user/me'时 额外添加Headers内Key: x-auth; Value: '注册用户时存放在header里的token'
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => { //login验真后，res.header加入token
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

//event监听3000端口有没有被req
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
})

module.exports = {app};
