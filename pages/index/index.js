import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()

Page({
  data: {
    test: false,
    userInfo: {},
    cancel: false, // 是否点击取消
    navBarHeight:0 ,// 头部高度
    recommendList: [{catid: 0, catname: "推荐"}], // 课程列表
    recommendIndex: 0, // 推荐列表索引
    currentSwiper: 0, // 当前轮播项目
    banner_list: [
      // {
      //   img : '../../public/images/banner.png',
      //   path :"../indexDetail/indexDetail?couseid=16"
      // },
      // {
      //   img : '../../public/images/banner02.png',
      //   path :"../indexDetail/indexDetail?couseid=1"
      // }
    ],
    normalUrl: '', // 默认图片路径
    courseList: [] ,// 推荐列表下的内容
    val:['1','2','3','4','1','1','1','1','1','1','1','1','1','1','1','1','1','1',]
  },
  onLoad() {
    // console.log(app.globalData)
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
    this.collect ()
    this.recommendList()
    this.getBannerList()
    this.getCourseList()
  },
  onShow() {
    this.recommendList()
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
  },
  // onPullDownRefresh: function() {
  //   this.recommendList()
  //   setTimeout(function() {
  //     wx.stopPullDownRefresh()
  //   },100)
  // },
  // 轮播图滑动事件
  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  // 获取轮播图
  getBannerList() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.getBannerList}`).then((res)=> {
      this.setData({
         banner_list : res.data.data
      })
      wx.hideLoading({})
    }).catch((e)=> {
      console.log(e)
      wx.hideLoading({})
    })
  },

  linkTo(e) {
    if(!e.currentTarget.dataset.id) {
      return
    }
    wx.navigateTo({
      url: `../indexDetail/indexDetail?couseid=${e.currentTarget.dataset.id}`
    }) 
  },
  handleRecommend() {
    this.setData({
      recommendTab: 0
    })
  },
  // 获取推荐列表数据
  recommendList() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.getCategoryList}`).then((res)=> {
      this.data.recommendList = [{catid: 0, catname: "推荐"}]
      let data = [...this.data.recommendList,...res.data.data]
      this.setData({
        recommendList:data
      })
      wx.hideLoading({})
    }).catch((e)=> {
      console.log(e)
      wx.hideLoading({})
    })
  },

  // 点击推荐列表
  getCourseList(e) {
    let catid
    if(e != undefined) {
      // console.log(e)
      this.setData({
        recommendIndex: e.target.dataset.index
      })
      catid = e.target.dataset.catid
    }else {
      catid = 0 
    }
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.getCourseList}?catid=${catid}`).then((res)=> {
      this.setData({
        courseList: res.data.data
      })
      wx.hideLoading({})
    }).catch((e)=> {
      console.log(e)
      wx.hideLoading({})
    })
  },

 // 授权登录
 getUserInfo (e) {
  // console.log(e)
    // wx.showLoading({
    //   title: '加载中',
    //   mask: 'true'
    // })
    if(e.detail.rawData) {
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
                  // learningDays: res.data.data.learningDays,
                  // learningDuration: res.data.data.learningDuration
                })
                app.globalData.userInfo = res.data.data
                wx.showToast({
                  title: '授权成功',
                  duration: 2000
                })
                // wx.hideLoading({})
              } else {
                // wx.hideLoading({})
              }
            })
          }
        },
        fail:()=> {
          console.log(e)
          // wx.hideLoading({})
        }
      })
    }else {
      wx.showToast({
        title: '需要授权才可以继续看课哦,\r\n请选择您要看的课程',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 跳转详情页
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

  collect () {
    let value = wx.getStorageSync('cancel')
    if (!value) {
        this.setData({
          cancel : true
        })
    }
  },
  handleCancel(){
    wx.setStorageSync('cancel', 'yes')
    this.setData({
      cancel : false
    })
  },
  // 分享
  onShareAppMessage:function(){
    return{
      title:"转发给好友",
      imageUrl:"",
      path:`pages/index/index`,
      success: function(res) {
        // console.log(res)
        // console.log(111)
      },
      fail: function(res) {
        // console.log(res)
      }
    }
  },

})
