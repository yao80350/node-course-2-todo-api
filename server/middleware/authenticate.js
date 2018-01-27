const {User} = require('./../models/user');
// 利用Middleware 多次用
let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(); //401验真不匹配
  });
};

module.exports = {authenticate};
