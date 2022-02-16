<template>
  <span style="display:none" />
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import Cookies from 'js-cookie'

export default {
  name: 'Guide',
  props: {
    guideShow: {
      type: Boolean,
      default: false,
      required: true
    },
    guideKey: {
      type: String,
      default: '',
      required: true
    },
    steps: {
      type: Array,
      required: true
    }
  },
  watch: {
    guideShow: function(newVal, oldVal) {
      if (!newVal) { return }
      this.handleShowGuide()
    }
  },
  methods: {
    handleShowGuide() {
      const length = this.steps.length
      if (length === 0 || !this.guideShow) { return }
      const value = '1'
      const close = Cookies.get(this.guideKey)
      if (close === value) { return }
      Cookies.set(this.guideKey, value, { expires: 36500 })
      const driver = new Driver({
        allowClose: false,
        closeBtnText: '关闭',
        doneBtnText: '知道了',
        nextBtnText: '下一条',
        prevBtnText: '上一条'
      })
      driver.defineSteps(this.steps)
      driver.start()
    }
  }
}
</script>
