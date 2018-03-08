const mongoose = require('mongoose');
const validator = require('validator'); //验真
const jwt = require('jsonwebtoken'); // 打码
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    // unique: true, //只能有一个 // unique 做 test.js 会报错
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
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  let user = this;

  return user.update({
    $pull: { // 抽掉符合条件的
      tokens: {token} // 满足 {token} 的tokens挖空
    }
  });
};

//statics类似methods 不同：是User的method
UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); //同上，做这步就会跳到server.js里call这个mothod下面的catch
  }

  return User.findOne({ //在User里找
    _id: decoded._id,
    'tokens.token': token, //找到tokens.token 需要用''
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) { //event: save之前做
  let user = this;

  if (user.isModified('password')) { //user的property 'password'值有没有改变
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash; //有改变就在save之前 hash
        next();
      });
    });
  } else {
    next();
  }
});

//model里验真{} 写在let UserSchema = new mongoose.Schema({}); //结果一样
//Obj User 是mongoose处理过的Obj 里面 不能加method，所有用到 new mongoose.Schema()
let User = mongoose.model('User', UserSchema);

module.exports = {User};
