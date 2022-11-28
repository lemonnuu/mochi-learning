const mongoose = require('mongoose')
const schemaBase = require('./schemaBase')
const encryption = require('../utils/md5')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (value) => encryption(value),
    select: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  ...schemaBase,
})

module.exports = userSchema
