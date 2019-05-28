<template lang="pug">
  .main
    .bg
    web-view(:src="url")
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        url: '',
        num: 1
      }
    },

    computed: {},

    components: {},
    methods: {
      cardInfo(item) {
        // wx.navigateTo({
        //   url: '../card-info-final/main?key=0'
        // })
      }
    },
    onLoad(event) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 3000
      })
      this.url = decodeURIComponent(event.url)
    },
    created() {
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx

  rpx = rpxf()

  page
    height 100%
    background #F0EFF5
    .main
      width 750 * rpx
      overflow hidden
      background #F0EFF5
      .bg
        height 320 * rpx
        padding-top 16 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        .webview
          width 750 * rpx
</style>
