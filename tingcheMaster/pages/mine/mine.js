const app = getApp()
const db = wx.cloud.database()
// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: app.globalData.user,
        commodityLogin:false,
        login:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    back(e){
      wx.navigateBack({
        delta: 1 // 1返回上一个界面，2返回上上个页面
        })
        },
    onLoad(options) {
      const userInfo = wx.getStorageSync('user')
      console.log(userInfo);
      // const userInfo = app.globalData.userInfo
      let login = app.globalData.login
      if (userInfo) {
        this.setData({
          canIUseGetUserProfile: true,
          userInfo:userInfo,
          login:true
        })
      }
    },

    openLogin(e){
        this.setData({
            commodityLogin:true
          })
    },


    /**
     * 
     * 用户开始登录
     */
    getProfile(){
      var that = this;
      let userInfo = that.data.userInfo
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log('用户资料',res);
          this.setData({
            userInfo : res.userInfo,
            login:true,
            commodityLogin:false
          })
          try{
            wx.setStorageSync('user', res.userInfo)
          }catch(e){console.log(1);}
          
          const test = wx.getStorageSync('user')
          console.log("test是：",test);
          console.log(res.userInfo);
        }
      })
    },
    // 
    close(e){
        this.setData({
            commodityLogin:false
        })
    },
      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {

      },
     /**
     * 用户点击右上角分享
     */
    onShareAppMessage(){

    },
    logout(e){
        if(this.data.userInfo){
            wx.showModal({
              cancelColor: 'cancelColor',
              title:'是否确定退出',
              success: res =>{
                if(res.confirm){
                  console.log("用户确定退出");
                  wx.clearStorageSync();
                  this.setData({
                    user:'',
                    login:false,
                  })
                  wx.showToast({
                    title: '退出成功',
                  })
                }else{
                  console.log("用户取消了退出")
                }
              }
            })
          }else{
            wx.showModal({
              cancelColor: 'cancelColor',
              title:'您还未登录！',
              success:function(res){
                if(res.confirm){
                  console.log("用户未登录")
                }
              }
            })
          }
    },
    //在线客服
    
})