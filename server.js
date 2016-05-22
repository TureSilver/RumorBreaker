var http = require('http');
var qs = require('querystring');
var url = require("url");
var fs = require('fs');

var body = qs.stringify({'apikey':'0ad13f9a-ee6a-4aa1-bd85-63d9a5832580'}) + '&';

// 记录日志
var log = function () {
  var now = new Date().toISOString();
  arguments[0] = '[' + now + '] ' + arguments[0];
  console.log.apply(console, arguments);
};

// 获取请求的headers，去掉host和connection
var getHeader = function (req) {
  var ret = {};
  for (var i in req.headers) {
    if (!/host|connection/i.test(i)) {
      ret[i] = req.headers[i];
    }
  }
  ret['content-type'] = 'application/x-www-form-urlencoded';
  if (/POST|PUT/i.test(req.method)) {
    ret['content-length'] = (parseInt(ret['content-length']) + body.length).toString();
  }
  return ret;
};

// 获取请求的路径
var getPath = function (req) {
  var url = req.url;
  if (url.substr(0, 7).toLowerCase() === 'http://') {
    var i = url.indexOf('/', 7);
    if (i !== -1) {
      url = url.substr(i);
    }
  }
  return url;
};

//转发
var api = function(req, res) {
  var modifyPath = function(path) {
    var paths = path.split('?');
    return '/1/api/sync' + paths[0].substr(4) + '/v1?' + paths[1];
  };
  counter++;
  var num = counter;
  var opt = {
    host:     'api.havenondemand.com',
    path:     modifyPath(getPath(req)),
    method:   req.method,
    headers:  getHeader(req)
  };
  log('#%d\t%s http://%s%s', num, req.method, opt.host, opt.path);
  var req2 = http.request(opt, function (res2) {
    res.writeHead(res2.statusCode, res2.headers);
    res2.pipe(res);
    res2.on('end', function () {
      log('#%d\tEND', num);
    });
  });
  if (/POST|PUT/i.test(req.method)) {
    req2.write(body);
    req.pipe(req2);
  } else {
    req2.end();
  }
  req2.on('error', function (err) {
    log('#%d\tERROR: %s', num, err.stack);
    res.end(err.stack);
  });
};

//页面
var page = function(req, res) {
  var path = getPath(req);
  if(path === '/') {
    path = './app/index.html';
  } else {
    path = './app' + path;
  }
  fs.readFile(path, function (err, html) {
    if (err) {
      res.end();
      return;
    }
    var contentType = "text/html";
    if (path.match('.css')) {
      contentType = "text/css";
    }
    res.writeHeader(200, {"Content-Type": contentType});
    res.write(html);
    res.end();
  })
};

// 代理请求
var counter = 0;
var onProxy = function (req, res) {
  var pathname = getPath(req);
  if (pathname.match('/api*')){
    api(req, res);
  } else {
    page(req, res);
  }
};


// 启动http服务器
var server = http.createServer(onProxy);
server.listen(8080);
log('proxy server listen on http://127.0.0.1:8080');