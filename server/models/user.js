const mongoose = require('mongoose');
const validator = require('validator'); //验真
const jwt = require('jsonwebtoken'); // 打码
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true, //只能有一个
    validate: { //自定义验真
      // validator: (value) => {
      //   return validator.isEmail(value);
      // },
      validator: validator.isEmail,  // 同上
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    tequire: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

//methods类似prototype
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'somesecret');

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

//model里验真{} 写在let UserSchema = new mongoose.Schema({}); //结果一样
//Obj User 是mongoose处理过的Obj 里面 不能加method，所有用到 new mongoose.Schema()
let User = mongoose.model('User', UserSchema);

module.exports = {User};
