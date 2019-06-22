const app = getApp();
// const convert = require('../../../utils/Convert_Pinyin').default;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    userInfo: {},
    options:{},
    minAngle: 30,//最小角度
    mescroll: null, //mescroll实例对象
    downOption: {
      auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
    },
    upOption: {
      // auto: true, //是否在初始化后,自动执行上拉回调callback; 默认true
      // page: {
      // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
      // 	size: 10 // 每页数据的数量
      // }
      empty: {
        btnText: "去添加 +" //按钮,默认""
      }
    },
  },
  properties: {
    myProperty: {
      type: String
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // console.log(1231);
      // console.log(this);
      // console.log(convert.getCamelChars('中国'));
      this.getUser();
      // this.getList();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      // console.log(4567);
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
    // console.log(this);
    this.getUser();
    // this.getList();
  },
  pageLifetimes:{
    show() { 
      // let options = this.options;
      // console.log(this.options);
      // // debugger
      // this.setData({
      //   options: options
      // })
    },
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  onReady() {
    
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  methods: {
    //注册滚动到底部的事件,用于上拉加载
    onReachBottom() {
      // console.log(this.data.mescroll);
      // this.data.mescroll && this.data.mescroll.onReachBottom();
    },
    //注册列表滚动事件,用于下拉刷新
    onPageScroll(e) {
      this.data.mescroll && this.data.mescroll.onPageScroll(e);
    },
    mescrollInit(mescroll) {
      // this.mescroll = mescroll;
      mescroll = mescroll.detail;
      this.setData({
        mescroll: mescroll
      })
    },
    /*下拉刷新的回调 */
    downCallback(mescroll) {

      mescroll = mescroll.detail;
      // console.log(111)
      mescroll.resetUpScroll();
    },

    upCallback(mescroll) {

      mescroll = mescroll.detail;
      this.getListData(mescroll);

    },
    //点击空布局按钮的回调
    emptyClick() {
       this.add();
    },
    copyText(e){
      var text = e.currentTarget.dataset.text
      wx.setClipboardData({
        data: text,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    },
    getListData(mescroll){
      const db = wx.cloud.database();
      db.collection('member').get({
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
        //  console.log(res);
         if(res.data&&res.data.length>0){
           res.data.forEach(item=>{
             item.shortName = item.name.substring(0,1);
           })
         }
        let length = res.data.length==0?0:6;
        mescroll.endSuccess(length);
        this.setData({
          list: res.data||[]
        })
        },
        fail: err => {
          mescroll.endErr();
          wx.showToast({
            icon: 'none',
            title: '查询失败'
          })
        }})
    },
    getUser() {
      try {
        const value = wx.getStorageSync('userInfor');
        if (value) {
          this.setData({
            userInfo: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    },
    choosePerson(e){
      // console.log(e);
      let data = e.currentTarget.dataset;
      // if (this.data.myProperty){
      //   const myEventDetail = data // detail对象，提供给事件监听函数
      //   const myEventOption = data // 触发事件的选项
      //   this.triggerEvent('myevent', myEventDetail, myEventOption);
      // }
      // console.log(data);
      wx.navigateTo({
        url: '../mine/add/add?id='+data.id,
      })
    },
    delPreson(e){
      // console.log(e);
      let data = e.currentTarget.dataset;
      wx.showModal({
        title: '删除提示',
        content: '确定要删除这条数据吗？',
        cancelText: '再看看',
        confirmText: '再见',
        success: res => {
          if (res.confirm) {
            this.delPresondb(data);
          }
        }
      })
    },
    /**
     * delPresondb删除数据
     */
    delPresondb(data){
      wx.showLoading({
        title: '加载中...',
      });
      const db = wx.cloud.database();
      const _id  = data.id;
      const that = this;
      db.collection('member').doc(_id).remove({
        success: (res) => {
          // console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '删除成功'
          });
          // this.getListData();
          this.data.mescroll.resetUpScroll();
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '删除失败'
          })
        }
      })
    },
    onMyEvent(e){
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption);
    },

    add() {
      let url = '../mine/add/add';
      if (this.data.myProperty){
        url = '../../mine/add/add';
      }
      wx.navigateTo({
        url: url,
      })
    },

    indexSelect(e) {
      let that = this;
      let barHeight = this.data.barHeight;
      let list = this.data.list;
      let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
      for (let i = 0; i < list.length; i++) {
        if (scrollY < i + 1) {
          that.setData({
            listCur: list[i],
            movableY: i * 20
          })
          return false
        }
      }
    },
    
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX,
        ListTouchStartY: e.touches[0].pageY
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (!e.changedTouches[0])return;
      let touchEnd = {
        pageX: e.changedTouches[0].pageX,
        pageY: e.changedTouches[0].pageY
      }
      let touchStart = {
        pageX: this.data.ListTouchStart,
        pageY: this.data.ListTouchStartY
      }
      let x = Math.abs(touchStart.pageX - touchEnd.pageX);
      let y = Math.abs(touchStart.pageY - touchEnd.pageY);
      let z = Math.sqrt(x * x + y * y);
      if (z !== 0) {
        let angle = Math.asin(y / z) / Math.PI * 180; // 两点之间的角度,区间 [0,90]
        if (angle > this.data.minAngle) return; // 如果小于配置的角度,则不往下执行下拉刷新
      }
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
  },
})