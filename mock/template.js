const Mock = require('mockjs')

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const imageUri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

const list = Mock.mock({
  'list|100-300': [
    {
      'id': '@increment()',
      'title': '@ctitle(5, 20)',
      'digest': '@cparagraph()',
      'createdDate': +Mock.Random.date('T'),
      'createdBy': '@cname()',
      'lastModifiedDate': +Mock.Random.date('T'),
      'lastModifiedBy': '@cname()',
      'deleted': '@boolean()'
    }
  ]
}).list

module.exports = [
  {
    url: '/templates/search',
    type: 'post',
    response: config => {
      const { title, pageNumber = 1, pageSize = 20 } = config.body

      const mockList = list.filter(item => !(title && item.title.indexOf(title) < 0))
      const pageList = mockList.filter((item, index) => index < pageSize * pageNumber && index >= pageSize * (pageNumber - 1))

      return {
        total: mockList.length,
        items: pageList
      }
    }
  },

  {
    url: '/templates/\\d+',
    type: 'get',
    response: config => {
      return {
        ...list[0],
        content: baseContent,
        imageUri: imageUri
      }
      // const { id } = config.query
      // for (const template of list) {
      //   if (template.id === +id) {
      //     return {
      //       ...template,
      //       content: baseContent,
      //       imageUri: imageUri
      //     }
      //   }
      // }
    }
  },

  {
    url: '/templates/\\d+/content',
    type: 'get',
    response: config => {
      return {
        ...list[0],
        content: baseContent,
        imageUri: imageUri
      }
      // const { id } = config.query
      // for (const template of list) {
      //   if (template.id === +id) {
      //     return {
      //       ...template,
      //       content: baseContent,
      //       imageUri: imageUri
      //     }
      //   }
      // }
    }
  },

  {
    url: '/templates',
    type: 'post',
    response: _ => { }
  },

  {
    url: '/templates/\\w+',
    type: 'delete',
    response: _ => { }
  }
]

