import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()
// let user_id
Page({
  data: {
    navBarHeight:0 ,// 头部高度
    userInfo: {
      learningDays: 0, // 学习天数
    } , // 用户信息
    learningDuration: 0, // 学习时长
    learningCourseNum: 0, // 学习课程
    myCourseList: [], // 我的课程
    normalUrl:'' // 默认图片路径
  },
  
  onLoad(options) {
    if(app.globalData.userInfo.nickname) {
      this.setData({ 
        userInfo: app.globalData.userInfo
      })
    }else {
      app.getData = (data)=> {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    }
    this.setData({
      navBarHeight: app.globalData.systemInfo.navBarHeight,
      normalUrl: API.normalUrl
    })
  },
  onShow() {
    if(app.globalData.userInfo.nickname) {
      this.setData({ 
        userInfo: app.globalData.userInfo
      })
    }else {
      app.getData = (data)=> {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    }
    this.getMycourseList()
    this.getDuration()
  },
  // 授权登录
  getUserInfo (e) {
    // console.log(e)
    if(e.detail.rawData) {
      wx.showLoading({
        title: '加载中',
        mask: 'true'
      })
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv
      wx.login({
        success: (res)=>{
          let code = res.code
          if(res.code) {
            // console.log(encryptedData)
            post(`${API.authLogin}`,{encryptedData,iv,code}).then ((res)=>{
              // console.log(res.data)
              if (res.data.code === 1) {
                this.setData({
                  userInfo: res.data.data,
                  learningDays: res.data.data.learningDays,
                  learningDuration: res.data.data.learningDuration
                })
                app.globalData.userInfo = res.data.data
                wx.hideLoading({})
                wx.showToast({
                  title: '授权成功',
                })
              }
            })
          }
        },
        fail: ()=> {
          wx.hideLoading({})
        }
      })
    }
  },

  // 我的课程
  getMycourseList() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    post(`${API.getMycourseList}`,{userId:this.data.userInfo.id}).then((res)=> {
      // console.log(res.data.data)
      this.setData({
        myCourseList: res.data.data
      })
      wx.hideLoading({})
    }).catch((e)=> {
      console.log(e)
      wx.hideLoading({})
    })
  },

  handleFree(e) {
    // console.log(e)
    let couseid = e.currentTarget.dataset.couseid
    if(!this.data.userInfo.nickname) {
      return
    }
    wx.navigateTo({
      url: `../indexDetail/indexDetail?couseid=${couseid}`
    });
  },

  // 查询学习天数
  getDuration() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    post(`${API.getDuration}`,{userId:this.data.userInfo.id}).then((res)=> {
      this.setData({
        learningDuration: res.data.data[0].learningDuration
      })
      wx.hideLoading({})
      // console.log(res.data.data[0].learningDuration)
    }).catch((e)=> {
      console.log(e)
      wx.hideLoading({})
    })
  },

  // 学习课程节数
  // setCourseNum() {
  //   post(`${API.setCourseNum}`,{user_id:this.data.userInfo.id}).then((res)=> {
  //     console.log(res)
  //   })
  // },
  
  
})
