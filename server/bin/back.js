var express = require('express')
var app = express();
var fs = require('fs')
var path = require('path')
var data = fs.readFileSync(path.join(__dirname, '../public/faker.json'), 'utf8')


var allowCrossDomain = function(req, res, next) {//设置response头部的中间件
  res.header('Access-Control-Allow-Origin', 'http://localhost:8089');//8089是vue项目的端口，这里相对于白名单
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCrossDomain);
app.get("/api/data",function (request,response) {
  response.send(data);
})
app.listen('3000',function () {
  console.log('>listening on 3000')
});
