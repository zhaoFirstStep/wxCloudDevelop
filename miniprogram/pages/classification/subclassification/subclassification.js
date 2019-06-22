const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    elements: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pageDate:{},
    userStatus: null,
    list:[],
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.data.pageDate = options;
    this.setData({
      pageDate: this.data.pageDate,
      userStatus: app.globalData.userStatus || null
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
    //  this.getDataList();
    if (this.data.mescroll) {
      this.data.mescroll.resetUpScroll();
    }
  },
  
  /**
   * 获取数据
   */
  getDataList(mescroll){
    const db = wx.cloud.database();
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // console.log(111);6
    let parentId  = this.data.pageDate.id;
    // console.log(parentId);
    db.collection('subclass').where({
      parentId: parentId
    }).get({
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // wx.hideLoading();
        let length = res.data.length == 0 ? 0 : 6;
        mescroll.endSuccess(length);
        this.setData({
          list: res.data || []
        })
      },
      fail: err => {
        // wx.hideLoading();
        mescroll.endErr();
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
      }
    })
  },
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
    this.getDataList(mescroll);

  },
  //点击空布局按钮的回调
  emptyClick() {
      this.add();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   * subclass
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

  },

  delete() {
    this.showModal();
  },
  showModal(e) {
    let data = e.currentTarget.dataset;
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这条数据吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.delSubClassdb(data);
        }
      }
    })
  },
  delSubClassdb(data) {
    wx.showLoading({
      title: '加载中...',
    });
    // console.log(data.id);
    wx.cloud.callFunction({
      name: 'deletSubClass',
      data: {
        id: data.id
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '删除成功'
        });
        // console.log(res);
        // this.getDataList();
        this.data.mescroll.resetUpScroll();
      },
      fail: res => {
        // console.log(res);
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
      }
    })
  },
  gosubList(e) {
    // console.log(e);
    let data = e.currentTarget.dataset;
    // console.log(this.data.pageDate);
    wx.navigateTo({
      url: '../sublist/sublist?subClassId=' + data.id +'&parentId='+this.data.pageDate.id,
    })
  },
  add() {
    let parentId  = this.data.pageDate.id;
    // console.log(parentId);
    wx.navigateTo({
      url: '../addsubclassification/addsubclassification?parentId=' + parentId,
    })
  }

})