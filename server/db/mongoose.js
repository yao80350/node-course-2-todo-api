const mongoose = require('mongoose');

let url = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(url);

module.exports = {mongoose};
