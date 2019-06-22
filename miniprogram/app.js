//app.js
App({
  onLaunch: function () {
    try{
      const data = wx.getStorageSync('userInforCount');
      this.globalData.userStatus = data.power;
      this.globalData.userInforObj = data;
      if(data.power){
        wx.reLaunch({
          url: './pages/index/index',
        })
      }else if(data){
        wx.reLaunch({
          url: './pages/classification/index/index',
        })
      }
    }catch(e){
       
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          // console.log(custom);
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    }

    // this.globalData = {}
  },
  globalData: {
     
  }
})
