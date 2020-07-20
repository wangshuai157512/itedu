import API from './utils/server'
import {get, post} from './utils/netUtil'
//app.js
App({
  onLaunch: function () {
    const getStatusHeight = () => {
      let systemInfo = wx.getSystemInfoSync();
      let rect = wx.getMenuButtonBoundingClientRect();
      let navHeight = systemInfo.statusBarHeight;
      systemInfo.navBarHeight = navHeight + rect.height + (rect.top - navHeight)*2;
      systemInfo.rect = rect;
      return systemInfo;
    }
    this.globalData.systemInfo = getStatusHeight()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 版本更新代码
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {

      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用自动更新版本功能，请升级到最新微信版本或手动更新。'
      })
    }

    // 登录
    wx.login({
      success: res => {
        let _this = this
        wx.request({
          url: `${API.iteduLogin}`,
          method : 'POST',
          data : {
            code : res.code
          },
          success : res => {
            // this.setData({
              if(res.data){
                _this.globalData.userInfo = res.data.data
              }
              if (_this.getData) {
                  _this.getData(res.data.data)
              }
              // that.globalData.userInfo = res.data.data
            // })
            // console.log(res.data.data)
          }
        })
        
      }
    })
  },
  onShow() {
      post(`${API.showContent}`,{name:"itedu"}).then((res)=> {
        this.globalData.showContent = res.data.data
      })
  },
  globalData: {
    userInfo: {},
    systemInfo: {},
    showContent: {}
  }
})