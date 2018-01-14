// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
// Connection URL
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  let db = client.db('TodoApp');

  //db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Todos').findOneAndDelete({completed: false }).then((result) => {
    console.log(result);
  });

  //client.close();
});
