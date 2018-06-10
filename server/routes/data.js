var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')
var data = fs.readFileSync(path.join(__dirname, '../public/faker.json'), 'utf8')

router.get("/data",function (request,response) {
  response.send(data);
})

module.exports = router;
