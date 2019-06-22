//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    PageCur: 'basics',
    modalName:undefined,
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
    this.data.compontents = this.selectComponent(`#${this.data.PageCur}`);
  },
 
  onPageScroll(e){
    // console.log(this.data.compontents);
    this.data.compontents.onPageScroll 
    && this.data.compontents.onPageScroll(e)
  },
  onLoad: function() {
    
    try {
      const value = wx.getStorageSync('userInfor');
      // debugger
      if (!value){
        this.showModal('Image');
      }
      if (value) {
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    // console.log('show');
    if (this.data.hiddenPage) {
      this.setData({
        PageCur: this.data.hiddenPage,
        hiddenPage: null
      })
    }
    // console.log(this);
    this.data.compontents = this.selectComponent(`#${this.data.PageCur}`);
    this.setData({
      compontents: this.data.compontents
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //  console.log('hidden');
    let hiddenPage = this.data.PageCur;
    this.setData({
      PageCur: null,
      hiddenPage: hiddenPage
    })
  },
})
