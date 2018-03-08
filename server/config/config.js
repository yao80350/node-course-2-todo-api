let env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  let config = require('./config.json'); // nodejs require 会将json文件转换成obj
  // console.log(config);
  let envConfig = config[env];
  // Object.keys(envConfig) --- js 代码 取obj key组成array
  // console.log(Object.keys(envConfig));
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; // 将property 值 存到process.env
  });
}
