const {ObejctID} = require('mongoose');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5a538c0759783b00d04f14aa'; // 下面3种情况，Id格式没错，找不到 会返回[], null, null

// if(!ObjectID.isvalid(id)) { //id是否有效
//   console.log('ID not valid'); // id无效提示
// }
//
// Todo.find({
//   _id: id //mongoose 不需要new ObejctID()  会自动转换
// }).then((todos) => {
//   console.log('Todos', todos); //todos --- array
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo); //todo --- obj
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('Id not found'); // id有效但找不到 提示
//   }
//   console.log('Todo By Id', todo); //todo --- obj
// }).catch((e) => console.log(e)); // id无效提示

User.findById(id).then((user) => {
  if(!user) {
    return console.log('Id not found');
  }
  console.log(`User By Id ${user}`);
}).catch((e) => console.log(e));
