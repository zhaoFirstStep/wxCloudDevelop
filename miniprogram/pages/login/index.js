// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: undefined,
    phone: '',
    password: '',
    showPage:false
  },
  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录
  login: function () {
    let _this = this;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 发送用户信息
      // wx.cloud.database
      const db = wx.cloud.database();
      wx.showLoading({
        title: '加载中...',
      })
      db.collection('member').where({
        username: this.data.phone
      }).get({
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          // console.log(res);
          wx.hideLoading();
          let data = res.data[0]||{};
          if (data.password === _this.data.password){
              wx.setStorageSync('userInforCount', data);
              app.globalData.userStatus = data.power;
              app.globalData.userInforObj = data;
              // debugger
              if(data.power){
                wx.reLaunch({
                  url: '../index/index',
                })
              }else{
                wx.reLaunch({
                  url: '../classification/index/index',
                })
              }
          }else if(!data.password){
            wx.showToast({
              title: '账户不存在！',
              icon: 'none'
            })
          }else {
            wx.showToast({
              title: '密码不正确！请重新输入。',
              icon:'none'
            })
          }
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '登陆失败请稍后再试！'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    try {
      const value = wx.getStorageSync('userInfor');
      const data = wx.getStorageSync('userInforCount');
      if (data){
        wx.redirectTo({
          url: '../index/index',
        })
      }else{
        this.setData({
          showPage:true
        })
      }
      // debugger
      if (!value) {
        this.showModal('Image');
      }
      if (value) {
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
    
  },
  hideModal(data) {
    let userInfor = data.detail;
    if (userInfor.errMsg === 'getUserInfo:ok') {
      try {
        wx.setStorageSync('userInfor', userInfor.userInfo);
        this.setData({
          modalName: null
        })
      } catch (e) { }
    }
  },
  showModal(e) {
    this.setData({
      modalName: e
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})