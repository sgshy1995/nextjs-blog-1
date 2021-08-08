"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignIn = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _getDBConnection = require("lib/getDBConnection");

var _crypto = _interopRequireDefault(require("crypto"));

var _User = require("src/entity/User");

var SignIn = /*#__PURE__*/function () {
  function SignIn() {
    (0, _classCallCheck2["default"])(this, SignIn);
    (0, _defineProperty2["default"])(this, "username", void 0);
    (0, _defineProperty2["default"])(this, "password", void 0);
    (0, _defineProperty2["default"])(this, "passwordDigest", void 0);
    (0, _defineProperty2["default"])(this, "hasError", true);
    (0, _defineProperty2["default"])(this, "result", {
      code: 422,
      message: '',
      status: false
    });
    (0, _defineProperty2["default"])(this, "user", void 0);
  }

  (0, _createClass2["default"])(SignIn, [{
    key: "validate",
    value: function () {
      var _validate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var connection, user, privateKey, hmac;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _getDBConnection.getDBConnection)();

              case 2:
                connection = _context.sent;

                if (!(!this.username || !this.username.trim())) {
                  _context.next = 7;
                  break;
                }

                this.result.message = '请输入用户名';
                _context.next = 15;
                break;

              case 7:
                if (this.password) {
                  _context.next = 11;
                  break;
                }

                this.result.message = '请输入密码';
                _context.next = 15;
                break;

              case 11:
                _context.next = 13;
                return connection.manager.findOne(_User.User, {
                  where: {
                    username: this.username
                  }
                });

              case 13:
                user = _context.sent;

                if (user) {
                  // 密码加盐对比数据库
                  privateKey = process.env.BACK_KEY;
                  hmac = _crypto["default"].createHmac("sha256", privateKey);
                  this.passwordDigest = hmac.update(this.password).digest("hex");

                  if (this.passwordDigest === user.passwordDigest) {
                    this.hasError = false; // 记录 user 信息，以便后面记录 session

                    this.user = user;
                  } else {
                    this.result.message = '用户名或密码错误';
                  }
                } else {
                  this.result.message = '用户名或密码错误';
                }

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function validate() {
        return _validate.apply(this, arguments);
      }

      return validate;
    }()
  }]);
  return SignIn;
}();

exports.SignIn = SignIn;