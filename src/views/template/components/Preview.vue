<template>
  <div class="marvel-device iphone5s silver">
    <div class="top-bar" />
    <div class="sleep" />
    <div class="volume" />
    <div class="camera" />
    <div class="sensor" />
    <div class="speaker" />
    <div class="screen" v-html="content" />
    <div class="home" />
    <div class="bottom-bar" />
  </div>
</template>

<script>
export default {
  name: 'TemplatePreview',
  props: {
    content: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.screen {
  overflow-y: auto;
}
</style>
