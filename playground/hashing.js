const {SHA256} = require('crypto-js'); //打码
const jwt = require('jsonwebtoken');

let data = {
  id: 10
};

let token = jwt.sign(data, 'somesecret');
console.log(token);

let decoded = jwt.verify(token, 'somesecret');
console.log('decoded', decoded);


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
