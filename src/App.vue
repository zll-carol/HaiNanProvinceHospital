<script>
  import RPC from './utils/request'
  export default {
    created() {
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    },
    onLaunch() {
      console.log('onLaunch')
      RPC.autoUpdate()
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx

  rpx = rpxf()
  .common
    width 750 * rpx
    height 100%
    overflow hidden
    background #F0EFF5
    text-align center
  .container
    height 100%
    display flex
    flex-direction column
    align-items center
    justify-content space-between
    padding 200 *rpx 0
    box-sizing border-box

  /* this rule will be remove */
  *
    transition width 2s
    -moz-transition width 2s
    -webkit-transition width 2s
    -o-transition width 2s

</style>
