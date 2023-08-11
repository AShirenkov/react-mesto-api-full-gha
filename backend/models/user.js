const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const AuthError = require('../errors/auth-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    // имя пользователя, строка от 2 до 30 символов, обязательное поле;
    type: String,

    minlength: 2,
    maxlength: 30,
    default: 'AShir84',
  },
  about: {
    // информация о пользователе, строка от 2 до 30 символов, обязательное поле;
    type: String,

    minlength: 2,
    maxlength: 30,
    default: 'Студент Я.Практикум',
  },
  avatar: {
    // ссылка на аватарку, строка, обязательное поле.
    type: String,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },

    default: 'https://klike.net/uploads/posts/2019-03/1551514046_26.jpg',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Неправильные почта или пароль'));
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('user', userSchema);
