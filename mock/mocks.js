const user = require('./user')
const role = require('./role')
const template = require('./template')
const config = require('./config')

module.exports = [
  ...user,
  ...role,
  ...template,
  ...config,
]

