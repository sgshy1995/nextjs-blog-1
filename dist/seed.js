"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _Posts = require("./entity/Posts");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var posts;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(connection);
            _context.next = 3;
            return connection.manager.find(_Posts.Posts);

          case 3:
            posts = _context.sent;

            if (!(posts.length === 0)) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return connection.manager.save([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) {
              return new _Posts.Posts({
                title: "\u6211\u7684\u7B2C".concat(n, "\u7BC7\u535A\u5BA2"),
                content: "\u8FD9\u662F\u6211\u7684\u535A\u5BA2\u5185\u5BB9\uFF0C\u975E\u5E38\u7684\u4E0D\u9519",
                date: "2021.04.03 11:11:23"
              });
            }));

          case 7:
            _context.next = 9;
            return connection.close();

          case 9:
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