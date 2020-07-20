
import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()
let couseid // 课程id
let user_id
let timer
let studyTime
Page({
  data: {
    show: '', // 展示视频还是图片
    userInfo: {}, 
    normalUrl: null, // 默认路径
    // courseDetailImg:'',
    videoUrl: '', // 视频路径
    videoUrlEver: '', // 每个子路径
    chapterList: null, // 视频内容
    videoIndex: 0, // 视频列表索引
    videoTab: 0, // 加类名
    videoHeight: null, //视频高度
    cover: true, // 视频封面
    bannerImage: 0, // bannerImage高度 
    navStyle: '',
    courseDetail: {}, // 课程详情
    courseList: ["课程介绍","课程目录"],  // 课程分类
    indexTab: 0, // 点击项
    open: true, // 第一项
    openOne: false,
    heightBox: 0, // 盒子高度
    heightBoxOne: 0, // 盒子高度
    shareAlart: false, //点击去分享
    id: 1, //章节id
    inquireList: null // 评价列表
  },
  onLoad(options) {
    // this.setHeight()
    // console.time("aa")
    // console.log(app.globalData)
    couseid= options.couseid
    if (app.globalData.userInfo.id) {
      user_id = app.globalData.userInfo.id
      this.courseDetail() // 查询课程信息
      this.setData({
        userInfo: app.globalData.userInfo,
        show:app.globalData.showContent
      })
    }else {
      app.getData = (data)=> {
        user_id = app.globalData.userInfo.id
        this.courseDetail() // 查询课程信息
        this.setData({
          userInfo: app.globalData.userInfo,
          userInfo: app.globalData.showContent
        })
      }
    }
    this.setData({
      // couseid: options.couseid,
      normalUrl: API.normalUrl
    })
  },

  onShow() {
    // this.courseDetail()
    this.screenHeight()
    this.inquire() // 查询评价
  },

  imgLoad() {
    // console.timeEnd('aa')
  },

  onReady () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  // 跳转落地页
  handleVideo() {
    wx.navigateTo({
      url:"../video/video"
    })
  },

  // 获取盒子高度
  // setHeight() {
  //   let that = this
  //   timer=setTimeout(function () {
  //     var query = wx.createSelectorQuery();
  //     query.select('.box'+that.data.videoIndex).boundingClientRect();
  //     query.exec(function (rect) {
  //       if (rect[0] === null) return;
  //       that.setData({
  //         heightBox: rect[0].height
  //       })
  //       console.log(rect)
  //       console.log(that.data.heightBox)
  //     });
  //     // var quer = wx.createSelectorQuery();
  //     // quer.select('.boxOne').boundingClientRect();
  //     // quer.exec(function (rec) {
  //     //   if (rec[0] === null) return;
  //     //   that.setData({
  //     //     heightBoxOne: rec[0].height
  //     //   })
  //     //   // console.log(rec)
  //     //   // console.log(that.data.heightBoxOne)
  //     // });
  //   }, 500)
    
  //   // clearTimeout(timer)
  // },
  // 获取视频高度
  screenHeight() {
    wx.getSystemInfo({
      success: (res)=> {
        let videoProportion= res.windowWidth/16
        this.setData({
          videoHeight: parseInt(videoProportion*9)
        })
      }
    })
  },

  // 获取手机号
  getPhoneNumber (e) {
    let _this = this
    let {encryptedData,iv} = e.detail
    if(e.detail.errMsg==="getPhoneNumber:ok") {
        wx.login({
      success(res) {
        if(res.code) {
          post(`${API.iteduAuthPhone}`,{
            code:res.code,
            encryptedData,
            iv
          }).then((res)=> {
              wx.showToast({
                title:"授权成功",
                icon: "none"
              })
              app.globalData.userInfo=res.data.data
              _this.setData({
                userInfo: res.data.data
              })
              // console.log(_this.data.userInfo)
          })
        }else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    }else {
      wx.showToast({
        title:"请先授权手机号",
        icon: "none"
      })
    }
  },

  // 获取课程详情数据
  courseDetail() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.courseDetail}?id=${couseid}&user_id=${user_id}`).then((res)=> {
      try{
        res.data.data.chapter[0].isShare = 1
      }catch(e) {

      }
      function object(a,b) {
        return a.id-b.id
      }
      res.data.data.chapter.sort(object)
      this.setData({
        courseDetail: res.data.data,
        videoUrl: `${this.data.normalUrl}${res.data.data.videoUrl}`,
        chapterList:res.data.data.chapter,
        videoUrlEver: res.data.data.chapter[0].childChapter[0].videoUrl  // 传题注释
      })
      wx.hideLoading({})
      this.setBanner()  // banner区域高度
    }).catch((e)=> {
      wx.hideLoading({})
    }) 
  },

  // 开始播放
  bindPlay() {
    this.setMycourse() // 设置已观看课程
    this.lookNum()
    studyTime=setInterval(this.setDuration,60000)
  },
  // 播放到末尾
  binDenDed() {
    clearInterval(studyTime)
  },
  // 暂停播放
  bindPause() {
    clearInterval(studyTime)
  },

  videoTitle(e) {
    this.setData({
      videoIndex: e.currentTarget.dataset.index,
      open: !this.data.open,
    })
    // this.setHeight()
  },
  openOne(e){
    // this.setHeight()
    this.setData({
      videoIndex: e.currentTarget.dataset.index,
      openOne: !this.data.openOne
    })
  },
  //点击更换视频
  videoTab(e) {
    this.setData({
      id:parseInt(e.currentTarget.dataset.id)
    })
    if(e.currentTarget.dataset.share == 0) {
      // this.handleShare()
      this.setData({
            shareAlart:true,
      })
    }else {
      this.setData({
        videoTab: e.currentTarget.dataset.index
      })
      if(this.data.videoUrlEver===e.currentTarget.dataset.videourlever) {
        return
      }
      this.setData({
        videoUrlEver: e.currentTarget.dataset.videourlever
      })
    }
  },

   // 学习时长
   setDuration() {
    post(`${API.setDuration}`,{userId:user_id,courseId:couseid,chapterId:chapterId}).then((res)=> {
      console.log(res)
    })
  },
  
  // 已观看课程
  setMycourse() {
    post(`${API.setMycourse}`,{userId:user_id,courseId:Number(couseid),chapterId:this.data.id}).then((res)=> {
      console.log(res)
    })
  },

  // 观看人数
  lookNum() {
    post(`${API.lookNum}`,{user_id:user_id,course_id:Number(couseid)}).then((res)=> {
      console.log(res)
    })
  },
  // 获取图片高度
  setBanner() {
    var banner = wx.createSelectorQuery()
    banner.select('.my_video').boundingClientRect((rect) => {
      this.setData({
        bannerImage:rect.height + 102
      })
      // heightImage = rect.height + 50
    }).exec();
  },
  onPageScroll(e) {
    if(e.scrollTop >= this.data.bannerImage) {
      this.setData({
        navStyle: 'position:fixed;top:0;z-index: 1000',
        // boxStyle: 'display:block;'
      })
    }else{
      this.setData({
        navStyle: '',
        // boxStyle: 'display:none;'
      })
    }
  },
  
 
  handleActive(e) {
    // this.setHeight()
    this.setData({
      indexTab: e.target.dataset.index
    })
  },

  // 点击分享
  handleShare() {
    this.setData({
      shareAlart:true
    })
  },
  // 点击取消分享
  handleWrong(e) {
    this.setData({
      shareAlart:false
    })
  },
  // 分享内容
  onShareAppMessage:function(){
    // 分享课程
    post(`${API.shareCourse}`,{chapter_id:this.data.id,id:couseid,user_id:user_id}).then((res)=> {
      // console.log(res)
      if(res.data.msg == "分享成功") {
        this.setData({
          shareAlart:false
        })
        this.courseDetail()
      }
    })
    
    return{
      title:"转发给好友",
      imageUrl:"",
      path:`pages/indexDetail/indexDetail?couseid=${couseid}`,
      success: function(res) {
        // console.log(res)
        // console.log(111)
      },
      fail: function(res) {
        // console.log(res)
      }
    }
  },

  // 评价
  // 去评价
  goEvaluation() {
    wx.navigateTo({
      url: `../writeEvaluation/writeEvaluation?couseid=${couseid}`
    });
  },

  // 查询评价
  inquire() {
    post(`${API.getEvaluation}`,{courseid:Number(couseid),page:1,num:3}).then((res)=> {
      this.setData({
        inquireList: res.data.data
      })
    })
  },
  // 查看评价
  seeEvaluation() {
    wx.navigateTo({
      url: `../userEvaluation/userEvaluation?couseid=${couseid}`
    });
  },


  onUnload() {
    clearTimeout(timer)
    clearInterval(studyTime)
  }
})
