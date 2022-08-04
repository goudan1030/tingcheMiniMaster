var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'ZCVBZ-UMSED-PPU4S-PQD5T-LX44S-2RBZU' // 必填
}); 
let phone = ''
Page({
  data: {
    target :'',
    index: null,
    detail: {},
    commentsList: [],
    ChildrenCommentsList: [],
    commentCount: '',
    commentValue: '',  
    postList: [],
    content: '',
    openid: "",
    userInfo: {}
  },
  onLoad: function (options) {
      var carInfo = wx.getStorageSync('carInfo')
      // 获取参数值
      this.setData({
        detail:carInfo
      })
  },
  onUnload: function () {
  },
  getLocation(e){
    let plugin = requirePlugin('routePlan');
    let key = 'C2CBZ-GMGLI-SH2GW-5KEXG-B4X3O-GVBXP';  //使用在腾讯位置服务申请的key
    let referer = '停车位出租';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': this.data.detail.location,
        'latitude': this.data.detail.latitude,
        'longitude': this.data.detail.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });

  },
  back(e){
    wx.navigateBack({
      delta: 1 // 1返回上一个界面，2返回上上个页面
      })
      },
    phoneCall(e){
      var carInfo = wx.getStorageSync('carInfo')
        console.log(carInfo.phone);
        wx.makePhoneCall({
          phoneNumber:carInfo.phone, //此号码并非真实电话号码，仅用于测试
          success:function(){
            console.log("拨打电话成功！")
          },
          fail:function(){
            console.log("拨打电话失败！")
          }
        })
    
    }
})