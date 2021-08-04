"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _User = require("./entity/User");

var _Post = require("./entity/Post");

var _Discussion = require("./entity/Discussion");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var manager, u1, p1, d1;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manager = connection.manager; // create user

            u1 = new _User.User();
            u1.username = 'sgs';
            u1.passwordDigest = 'md5';
            _context.next = 6;
            return manager.save(u1);

          case 6:
            // create post
            p1 = new _Post.Post();
            p1.title = '我的第一篇博客';
            p1.content = '这是我的博客内容，你稍微看一下';
            p1.author = u1;
            _context.next = 12;
            return manager.save(p1);

          case 12:
            // create discussion
            d1 = new _Discussion.Discussion();
            d1.content = '这篇文章写得还不错，值得推荐！';
            d1.user = u1;
            d1.post = p1;
            _context.next = 18;
            return manager.save(d1);

          case 18:
            _context.next = 20;
            return connection.close();

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}())["catch"](function (error) {
  return console.log(error);
});