import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()
let user_id
let pagNum
let couseid
Page({
  data: {
    userInfo: {},
    inquireList: [],  // 评价列表
    hasMore:0
  },
  
  onLoad(options) {
    if (app.globalData.userInfo.id) {
      // user_id = app.globalData.userInfo.id
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }else {
      app.getData = (data)=> {
        // user_id = app.globalData.userInfo.id
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    }
    pagNum = 1
    couseid= options.couseid
  },
  onShow() {
    this.loadMsg()
  },
  // 查询评价
  // quire() {
  //   post(`${API.getEvaluation}`,{couseid:Number(couseid),page:1,num:4}).then((res)=> {
  //     this.setData({
  //       inquireList: res.data.data
  //     })
  //   })
  // },
  
   //上拉加载
   onReachBottom(){
    if (this.data.hasMore === 0) {
          this.loadMsg()
      }
  },
  loadMsg() {
    let _this = this
    this.setData({
      hasMore:1,
    })
    post(`${API.getEvaluation}`,{courseid:couseid,page:pagNum,num:10}).then((res)=>{
      // console.log(res)
      if(res.data.data && res.data.data.length !== 0) {
        pagNum++
        setTimeout(()=>{
          _this.setData({
            inquireList: this.data.inquireList.concat(res.data.data),
            // list: res.data.course,
            hasMore: 0
          })
        },1200)
      }else if (res.data.data && res.data.data.length < 10) {
        _this.setData({
          hasMore: 2
        })
      } else if(res.data.data && res.data.data.length === 0){
        _this.setData({
          hasMore: 2
        })
      }else{
        console.log('服务器异常')
      }
    })
  },
  loadMore() {
    this.loadMsg()
  },
})
