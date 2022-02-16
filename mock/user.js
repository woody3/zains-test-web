const Mock = require('mockjs')
const tokens = {
  admin: {
    token: 'admin-token'
  },
  user: {
    token: 'user-token'
  }
}

const users = {
  'admin-token': {
    permissions: ['template', 'user', 'permission', 'config'],
    introduction: 'I am a super administrator',
    avatar: undefined,
    name: 'Super Admin',
    username: '',
    enabled: true,
    isAdmin: true
  },
  'user-token': {
    permissions: ['template'],
    introduction: 'I am an user',
    avatar: undefined,
    name: 'Normal User',
    username: '',
    enabled: true,
    isAdmin: false
  }
}

const list = Mock.mock({
  'list|10': [{
    'id': /[a-z]{4,8}[0-9]{4}/,
    'username': /[a-z]{4,8}/,
    'name': '@cname()',
    'enabled': '@boolean()',
    'isAdmin': '@boolean()',
  }]
}).list
module.exports = [
  // user login
  {
    url: '/login',
    type: 'post',
    response: (req, res) => {
      const { username } = req.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return 'Account and password are incorrect.'
      }

      return token
    }
  },

  // user logout
  {
    url: '/logout',
    type: 'post',
    response: _ => { }
  },

  // get user info
  {
    url: '/users/current',
    type: 'get',
    response: config => {
      const token = config.headers['x-user-token']
      const info = users[token]

      // mock error
      if (!info) {
        return 'Login failed, unable to get user details.'
      }

      return info
    }
  },

  {
    url: '/users/\\w+',
    type: 'get',
    response: config => {
      return list[0]
    }
  },

  {
    url: '/users/search',
    type: 'post',
    response: config => {
      const { pageNumber = 1, pageSize = 20 } = config.body

      const pageList = list.filter((item, index) => index < pageSize * pageNumber && index >= pageSize * (pageNumber - 1))

      return {
        total: list.length,
        items: pageList
      }
    }
  },

  {
    url: '/users',
    type: 'get',
    response: _ => list
  },

  {
    url: '/users',
    type: 'post',
    response: _ => { }
  },

  {
    url: '/users/\\w+',
    type: 'delete',
    response: _ => { }
  },

  {
    url: '/users/\\w+',
    type: 'put',
    response: _ => { }
  },

]
