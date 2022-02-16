const Mock = require('mockjs')

module.exports = [

  {
    url: '/configs',
    type: 'get',
    response: config => {
      return { sinaShortUrlAppKey: ['123'].join(',') }
    }
  },

  {
    url: '/configs',
    type: 'post',
    response: config => {
    }
  },

]
