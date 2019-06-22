const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    toHome: {
      type: [Boolean, String],
      default: false
    },
    isCancel:{
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    cancel(e){
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption);
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    Backlogin(){
      app.globalData.userStatus = undefined;
      app.globalData.userInforObj = {};
      // wx.clearStorageSync();
      try {
        wx.removeStorageSync('userInforCount');
      } catch (e) {

      }
      wx.reLaunch({
        url: '/pages/login/index',
      })
    }
  }
})