var express = require('express')
var app = express();
var fs = require('fs')
var path = require('path')
var dataPath = path.join(__dirname, '../public/faker.json')
var data = fs.readFileSync(dataPath, 'utf8')


var allowCrossDomain = function(req, res, next) {//设置response头部的中间件
  res.header('Access-Control-Allow-Origin', 'http://localhost:8089');//8089是vue项目的端口，这里相对于白名单
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCrossDomain);
app.get("/api/data",function (request,response) {
  const change = parseInt(request.param('change'))
  if (change === 1) {
    const name = request.param('name')
    if (name === '匿名') return
    const score = request.param('score')

    let newData = JSON.parse(data)
    newData[name] = score

    fs.writeFileSync(dataPath, JSON.stringify(newData))
  } else {
    response.send(data);
  }
})
app.listen('3000',function () {
  console.log('>listening on 3000')
});
