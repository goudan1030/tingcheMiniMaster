/**
 * Author : 张俊凯
 * Wechat : 10768029
 */
var app = getApp()
const db = wx.cloud.database()
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var Interval;

Page({
  data: {
      x:'',
      y:'',
      tasks:'',
      detailObj: {},
    index: null,
    regionchange:'',
    postsList: [],
    chooseLocation:false,
    login:false,
    floatDisplay: "none",
    isFirst: false, // 是否第一次打开,
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 自定义分享朋友圈
  onShareTimeline: function () {
    return {
      path: 'pages/index/index',

    }
  },

  onReachBottom: function () {
  },
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('user')
    if (userInfo) {
      this.setData({
        canIUseGetUserProfile: true,
        userInfo:userInfo,
        login:true
      })
    }
    qqmapsdk = new QQMapWX({
      key:'ZCVBZ-UMSED-PPU4S-PQD5T-LX44S-2RBZU'
  });
  wx.cloud.callFunction({
    name:'getList',
  }).then(res=>{
    console.log(res);
    this.setData({
      tasks:res.result.data
    })
  })
  },
       /**
     * 点击之后回到当前位置
     */
    backLocal(e){
      wx.showToast({
        title: '加载中',
        icon:'loading'
      })
      let mpCtx = wx.createMapContext('map') // 这里一定要写你自己的map的id，类似于getElementById
         mpCtx.moveToLocation()
    },
  onShow: function (options) {
    let mpCtx = wx.createMapContext('map') // 这里一定要写你自己的map的id，类似于getElementById
    mpCtx.moveToLocation()
  },

  //搜索地址
  getkm : function () {/*利用两地经纬度计算距离*/
    if (this.data.x!=0&&this.data.x1_aim!=0) {
      var R=6371.393
      var Pi=Math.PI
      var x1,y1,x2,y2
      x1=this.data.x
      y1=this.data.y
      x2=this.data.x1_aim
      y2=this.data.y1_aim
     var a=(Math.sin(Pi/180*(y1/2-y2/2)))**2
     var b= Math.cos(y1*Pi/180)*Math.cos(y2*Pi/180)*Math.sin((x1/2-x2/2)*Pi/180)**2
     var L=2*R*Math.asin((a+b)**0.5)
     this.setData({
     map_ans:L.toPrecision(3)
     })
     console.log(L)
     console.log("km")
    }else{
    console.log("earro")
    }
  },

  //搜索地址
  gotoSearch:function(){
    wx.chooseLocation({
      success:(e)=> {
        console.log(e);
        this.setData({
          address:e,
          chooseLocation:true,
          x:e.longitude,
          y:e.latitude,
          map_localname:e.address,
          show:true,
        })
        if (this.data.x!=0&&this.data.x1_aim!=0) {
          this.setData({map_flag:true})
        }if (this.data.map_flag) {
          this.getkm()
        }
      }
    })
    
  },

   // 显示组件
  showSelector() {
      this.setData({
      selectorVisible: true,
      });
  },

  // 当用户选择了组件中的城市之后的回调函数
  onSelectCity(e) {
      const { province, city } = e.detail;
      this.setData({
      selectedProvince: province,
      selectedCity: city,
      });
  },



  // 跳转至查看文章详情
  bindDetail: function (e) {
      console.log(e);
    // console.log('查看文章');
    var index = e.currentTarget.dataset.index
    var url = '../detail/detail?index=' +index ;
    wx.setStorageSync('carInfo', this.data.tasks[index])
    wx.navigateTo({
      url: url
    })
  },
})
