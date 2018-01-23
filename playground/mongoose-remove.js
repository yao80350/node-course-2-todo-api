const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// Todo.findOneAndRemove({_id: '5a6329f7b3d3200e2064274e'}).then((todo) => {
//   console.log(todo);  //--- return removed doc
// });

Todo.findByIdAndRemove('5a6329f7b3d3200e2064274e').then((todo) => {
  console.log(todo); // findByIdAndRemove() --- return removed doc
});
