"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _typeorm = require("typeorm");

var _Post = require("./Post");

var _Discussion = require("./Discussion");

var _getDBConnection = require("../../lib/getDBConnection");

var _crypto = _interopRequireDefault(require("crypto"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

var User = (_dec = (0, _typeorm.Entity)('users'), _dec2 = (0, _typeorm.PrimaryGeneratedColumn)(), _dec3 = (0, _typeorm.Column)('varchar'), _dec4 = (0, _typeorm.Column)('text'), _dec5 = (0, _typeorm.Column)('varchar'), _dec6 = (0, _typeorm.CreateDateColumn)(), _dec7 = (0, _typeorm.UpdateDateColumn)(), _dec8 = (0, _typeorm.OneToMany)(function (type) {
  return _Post.Post;
}, function (post) {
  return post.author;
}), _dec9 = (0, _typeorm.OneToMany)(function (type) {
  return _Discussion.Discussion;
}, function (discussion) {
  return discussion.id;
}), _dec10 = (0, _typeorm.BeforeInsert)(), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function User() {
    (0, _classCallCheck2["default"])(this, User);
    (0, _initializerDefineProperty2["default"])(this, "id", _descriptor, this);
    (0, _initializerDefineProperty2["default"])(this, "username", _descriptor2, this);
    (0, _initializerDefineProperty2["default"])(this, "avatar", _descriptor3, this);
    (0, _initializerDefineProperty2["default"])(this, "passwordDigest", _descriptor4, this);
    (0, _initializerDefineProperty2["default"])(this, "createdAt", _descriptor5, this);
    (0, _initializerDefineProperty2["default"])(this, "updatedAt", _descriptor6, this);
    (0, _initializerDefineProperty2["default"])(this, "posts", _descriptor7, this);
    (0, _initializerDefineProperty2["default"])(this, "discussions", _descriptor8, this);
    (0, _defineProperty2["default"])(this, "secretPTag", void 0);
    (0, _defineProperty2["default"])(this, "secretPCTag", void 0);
    (0, _defineProperty2["default"])(this, "password", void 0);
    (0, _defineProperty2["default"])(this, "passwordConfirm", void 0);
    (0, _defineProperty2["default"])(this, "hasError", true);
    (0, _defineProperty2["default"])(this, "result", {
      code: 422,
      message: '',
      status: false
    });
  }

  (0, _createClass2["default"])(User, [{
    key: "validate",
    value: function () {
      var _validate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var connection, found;
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
                _context.next = 35;
                break;

              case 7:
                if (/[a-zA-Z0-9]/g.test(this.username.trim())) {
                  _context.next = 11;
                  break;
                }

                this.result.message = '用户名只能包含英文或数字';
                _context.next = 35;
                break;

              case 11:
                if (!(this.username.length > 14)) {
                  _context.next = 15;
                  break;
                }

                this.result.message = '用户名长度不可超出14位';
                _context.next = 35;
                break;

              case 15:
                if (this.password) {
                  _context.next = 19;
                  break;
                }

                this.result.message = '请输入密码';
                _context.next = 35;
                break;

              case 19:
                if (!(this.password.length < 8 || this.password.length > 18)) {
                  _context.next = 23;
                  break;
                }

                this.result.message = '请输入8至18位密码';
                _context.next = 35;
                break;

              case 23:
                if (this.passwordConfirm) {
                  _context.next = 27;
                  break;
                }

                this.result.message = '请输入确认密码';
                _context.next = 35;
                break;

              case 27:
                if (!(this.password !== this.passwordConfirm)) {
                  _context.next = 31;
                  break;
                }

                this.result.message = '两次密码不一致';
                _context.next = 35;
                break;

              case 31:
                _context.next = 33;
                return connection.manager.findOne(User, {
                  username: this.username
                });

              case 33:
                found = _context.sent;

                if (found) {
                  this.result.message = '用户名已存在';
                } else {
                  this.hasError = false;
                }

              case 35:
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
  }, {
    key: "generatePasswordDigest",
    value: function generatePasswordDigest() {
      // 后端加盐存储密码加密。获取私钥。
      var privateKey = process.env.BACK_KEY;

      var hmac = _crypto["default"].createHmac("sha256", privateKey);

      this.passwordDigest = hmac.update(this.password).digest("hex");
    }
  }]);
  return User;
}(), _temp), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "id", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "username", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "avatar", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "passwordDigest", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "createdAt", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "updatedAt", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "posts", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "discussions", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "generatePasswordDigest", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "generatePasswordDigest"), _class2.prototype)), _class2)) || _class);
exports.User = User;