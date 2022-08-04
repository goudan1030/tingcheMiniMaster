const app = getApp()
const db = wx.cloud.database()
const queue = db.collection('carList')
const util = require('../../utils/util.js');
let carPhone = ""
let carPrice = ''
let carMonthly = false
let carTitle = ''
let carInfo = ''
let jwt_token=''
Page({

    /**
     * 页面的初始数据
     */
    data: {
      login:false,
      imgSrc: '',
      showUploadTip: false,
    haveGetImgSrc: false,
        x:'',
        y:'',
        location:'',
      inputShowed:false,
      titleinput:'',
      isUpload:false,
      infoinput:'',
      phoneinput:'',
      openid:'',
      jwt_token:'',
      post_author:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const userInfo = wx.getStorageSync('user')
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true,
          userInfo:userInfo,
          login:true
        })
        console.log(userInfo);
      }else{
        wx.showModal({
            title: '提示',
            content: '未登录，请先登录',
            success: function (res){
                console.log(res);
              wx.navigateTo({
                url: '/pages/mine/mine',
              })
            }
          })
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      var nowtime = new Date().getTime()
      console.log('现在的时间是'+nowtime)
    },
 /**
     * 
     * @param {*} times  时间戳
     * 转换为  yyyy-MM-dd HH:MM:SS 格式的日期
     */
    formatDate: function (times) {
      var date = new Date(times);
      var year = date.getFullYear(); //年份
      var month = date.getMonth() + 1; //月份
      var day = date.getDate(); //日
      var hour = function () { //获取小时
          return date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      }
      var minute = function () { //获取分钟
          return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      }

      var second = function () { //获取秒数
          return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      }
      return year + '-' + month + '-' + day + ' ' + hour() + ':' + minute() + ':' + second()

  },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    
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
        /**
         * 用户点击所在位置
         */
        getLocation(e){
          wx.chooseLocation({
            success:(e)=> {
            //   console.log(e);
              this.setData({
                address:e,
                chooseLocation:true,
                x:e.longitude,
                y:e.latitude,
                map_localname:e.address,
                location:e.address,
                show:true,
              })
              console.log("x是：",this.data.x);
              console.log("y是：",this.data.y);
              if (this.data.x!=0&&this.data.x1_aim!=0) {
                this.setData({map_flag:true})
              }if (this.data.map_flag) {
                this.getkm()
              }
            }
          })
        },
        /**
         * 用户点击右上角分享
         */
        onShareAppmessage_test() {
        },

        chooseImage:function(){
            wx.chooseImage({
                count: 1,
                success: chooseResult => {
                    var timestamp = (new Date()).valueOf();//新建日期对象并变成时间戳
                  // 将图片上传至云存储空间
                  wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: "img/"+timestamp+".jpg", // 上传至云端的路径
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: chooseResult.tempFilePaths[0],
                    config: {
                      env: this.data.envId
                    }
                  }).then(res => {
                    console.log('上传成功', res);
                    this.setData({
                      haveGetImgSrc: true,
                      imgSrc: res.fileID,
                      isUpload:true
                    });
                    wx.hideLoading();
                  }).catch((e) => {
                    console.log(e);
                    wx.hideLoading();
                  });
                },
              });
        },
        //获取车位详情内容
        getInfo(event){
          carInfo=event.detail.value
          console.log(carInfo);
        },
        //获取车位标题内容
        getTitle(event){
          if(event.detail.value ==''){
            wx.showToast({
              title: '请填写车位标题信息',
            })
          }else{
            carTitle=event.detail.value
            console.log(carTitle);
          }
        },
        //获取联系电话
        getPhone(event){
            carPhone=event.detail.value
            console.log(carPhone);
        },
        //获取个人微信
        getWechat(event){
            carWechat=event.detail.value
            console.log(carWechat);
        },
        //获取出租价格
        getPrice(event){
            carPrice=event.detail.value
            console.log(carPrice)
        },
        //获取是否可以月付
        switch1Change(e){
            var status=e.detail.value
            console.log(status);
            carMonthly=status
            console.log(carMonthly);
        },
    sumbit(e){
      var that = this;
        //    获取系统时间
        var nowtime = new Date().getTime()
        var sendtime = that.formatDate(nowtime)
        console.log(sendtime);
        const userInfo = wx.getStorageSync('user')
        var jd = this.data.x
        var wd = this.data.y
        console.log("jd是:",jd);
        console.log('wd的:',wd);
      var that = this;
      if(carInfo =='' ||carTitle==''||carPhone==''||carMonthly==''){
        wx.showToast({
          title: '请完善表单内容',
          icon:'none',
          duration:1500
        })
      }else{
        queue.add({
          data: {
            title: carTitle,
            content:carInfo,
            phone:carPhone,
            price:carPrice,
            location:that.data.address.address,
            monthly:carMonthly,
            longitude:jd,
            latitude:wd,
            username:userInfo.nickName,
            userAva:userInfo.avatarUrl,
            image:this.data.imgSrc,
            sendtime:sendtime,
            time:nowtime
            },
        }).then(res=>{
            wx.showModal({
                title: '提示',
                content: '发布成功！前往首页查看吧～',
                success: function (res){
                    console.log(res);
                  wx.navigateTo({
                    url: '/pages/home/home',
                  })
                }
              })
        })
      }

    },
    back(e){
        wx.navigateBack({
            delta: 1 // 1返回上一个界面，2返回上上个页面
            })
    },

})