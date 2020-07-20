import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()
// let starNum = 0
let description
let submitTimer
let couseid
Page({
  data: {
    stars: [
      {lightImg: '../../public/images/starCheck.png',
      blackImg: '../../public/images/star.png',
      flag: 2},
      {lightImg: '../../public/images/starCheck.png',
      blackImg: '../../public/images/star.png',
      flag: 2},
      {lightImg: '../../public/images/starCheck.png',
      blackImg: '../../public/images/star.png',
      flag: 2},
      {lightImg: '../../public/images/starCheck.png',
      blackImg: '../../public/images/star.png',
      flag: 2},
      {lightImg: '../../public/images/starCheck.png',
      blackImg: '../../public/images/star.png',
      flag: 2},
    ],
    starNum: 0,
    submitState: false
  },
  
  onLoad(options) {
    // console.log(options)
    couseid= options.couseid
  },

  // 评分
  star(e) {
    // console.log(e.currentTarget.dataset.index+1)
    this.setData({
       starNum: e.currentTarget.dataset.index+1
    })
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 2
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 1
      })
    }
  },

  impedance(e) {
    // console.log(e)
    // console.log(222)
    if(e.detail.value.length > 0) {
      this.setData({
        submitState:true
      })
    }
  },
  // 提交
  bindFormSubmit(e) {
    // console.log(e.detail.value.textarea.length)
    // if(e.detail.value.textarea.length > 0) {
    //   this.setData({
    //     submitState:true
    //   })
    // }
    let userId = app.globalData.userInfo.id
    description = e.detail.value.textarea
    post(`${API.add}`, {userId,courseid:Number(couseid),starNum:this.data.starNum,description}).then((res) => {
      if(res.data.code == 1) {
        description = 0
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1500
        });
        submitTimer=setTimeout(function() {wx.navigateBack({
          delta: 1
        })},1500)
      }
    })
  },
  
  onUnload() {
    clearTimeout(submitTimer)
  }
})
