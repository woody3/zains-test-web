const Mock = require('mockjs')

const roleList = Mock.mock({
  'list|100-300': [
    {
      'id|+1': 1,
      'name': '@cword(3,8)',
      'isAdmin': '@boolean'
    }
  ]
}).list

const userList = Mock.mock({
  'list|3-12': [
    {
      'id|+1': 1,
    }
  ]
}).list

/*
{
  code: '权限代码',
  name: '模块名称'
}
*/
const permissions = [
  {
    code: 'template',
    name: '模板管理'
  },
  {
    code: 'user',
    name: '用户管理'
  },
  {
    code: 'permission',
    name: '权限管理'
  },
  {
    code: 'config',
    name: '系统设置'
  }
]

module.exports = [
  {
    url: '/roles/search',
    type: 'post',
    response: config => {
      const { pageNumber = 1, pageSize = 20 } = config.body

      const pageList = roleList.filter((item, index) => index < pageSize * pageNumber && index >= pageSize * (pageNumber - 1))

      return {
        total: roleList.length,
        items: pageList
      }
    }
  },

  {
    url: '/roles',
    type: 'post',
    response: {
      key: Mock.mock('@integer(300, 5000)')
    }
  },

  {
    url: '/roles/[\w+]',
    type: 'delete',
    response: config => {
    }
  },

  {
    url: '/roles/[\w+]/users',
    type: 'get',
    response: _ => userList
  },

  {
    url: '/permissions',
    type: 'get',
    response: _ => permissions
  },

  {
    url: '/permissions/[\w+]',
    type: 'get',
    response: _ => permissions
  }
]
