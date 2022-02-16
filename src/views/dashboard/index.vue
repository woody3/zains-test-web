<template>
  <div class="dashboard-container">
    <div class="clearfix">
      <div class="info-container">
        <span class="display-name">{{ name }}</span>
        <span>{{ date | formatTime('yyyy-MM-dd w HH:mm:ss') }}</span>
      </div>
    </div>
    <div>
      <img class="emptyGif" src="/static/images/welcome.gif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      date: new Date().getTime()
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    setInterval(() => {
      this.date += 1000
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
/** 首页 */
.dashboard-container {
  background-color: #e3e3e3;
  min-height: calc(100vh - 50px);
  padding: 50px 60px 0px;
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display-name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }
}
</style>
