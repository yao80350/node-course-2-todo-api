const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user')

let userOneId = new ObjectID();
let userTwoId = new ObjectID();
let userThirdId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'test1@abc.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET)
  }]
},{
  _id: userTwoId,
  email: 'test12@abc.com',
  password: 'userTwoPass'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  },{
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
    return done;
  }).then(() => {
    done();
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // 不用insertMany，是因为save之前要做hash
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]); //上面2者都做完做then，用[]
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
