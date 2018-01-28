const {SHA256} = require('crypto-js'); //打码
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); //密码hash + salt

let password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

let hashdPassword = '$2a$10$n4B36oBPJ1G5BoJl2fRUoeSHr50AjT812EocpmDA8OzdCVRRokC7K';
//用9个单位的salt ---> hash
let hashdPassword2 = '$2a$09$RGA1iMGTD8kw4tQqXFHiZuA43CQeRERuH.x3vkkSZ3bOPA255pxbO';

bcrypt.compare(password, hashdPassword, (err, res) => { //compare 比较 //true or false
  console.log(res); //true
});

bcrypt.compare(password, hashdPassword2, (err, res) => {
  console.log(res); //true
});

// let data = {
//   id: 10
// };
//
// let token = jwt.sign(data, 'somesecret');
// console.log(token);
//
// let decoded = jwt.verify(token, 'somesecret');
// console.log('decoded', decoded);

// let data = {
//   id: 4
// };
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //data 是 obj 转成 string
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
