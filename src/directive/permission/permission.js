import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const permissions = store.getters && store.getters.permissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasPermission = permissions.some(role => {
        return value.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
