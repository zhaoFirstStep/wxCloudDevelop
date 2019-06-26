// pages/classification/sublist/sublist.js
const app = getApp();
const perPage = 15;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    tab0: { mescroll: null, isListInit: false, scrollY: 0, list: [] },//使用
    tab1: { mescroll: null, isListInit: false, scrollY: 0, list: [] },//保养/维修
    pageDate: {},//页面参数
    allLoad: false,
    skip: 0,//分页参数
    limit: perPage,//最大参数
    scrollLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.pageDate = options;
    this.setData({
      pageDate: this.data.pageDate
    })
  },

  tabSelect(e) {
    let type = e.currentTarget.dataset.id;

    if (this.data.TabCur !== type) {
      var curTab = this.getTabData(this.data.TabCur);//当前tab
      var newTab = this.getTabData(type);//准备切换过去的tab
      // this.tabType = type;//切换菜单
      this.setData({//切换菜单
        TabCur: type,
        // list: [],
        // skip: 0,
        limit: perPage,
        allLoad: false,
        scrollLeft: (type - 1) * 60
      })
      // console.log(newTab)
      if (!newTab.isListInit) {
        // 如果列表没有初始化过,则初始化
        console.log(11)
        newTab.mescroll.resetUpScroll();
      } else {
        //记录当前滚动条的位置
        curTab.scrollY = curTab.mescroll.getScrollTop();
        //延时,待界面更新后,滚动到指定位置
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: this.getTabData(type).scrollY,
            duration: 0
          });
        }, 30)
      }
    }
  },

  add() {
    let data = this.data.pageDate;
    // 6
    // logType
    // parentId
    wx.navigateTo({
      url: '../subadd/subadd?parentId=' + data.parentId + '&subClassId=' + data.subClassId + '&logType=' + this.data.TabCur,
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  // onReachBottom: function () {
  //   if (!this.data.allLoad) {
  //     this.data.skip += perPage;
  //     this.data.limit += perPage;
  //     this.getDataList();
  //   }
  //   // console.log(1231);
  // },
  //注册滚动到底部的事件,用于上拉加载
  onReachBottom() {
    this.data.tab0.mescroll && this.data.tab0.mescroll.onReachBottom();
    this.data.tab1.mescroll && this.data.tab1.mescroll.onReachBottom();
  },
  //注册列表滚动事件,用于下拉刷新
  onPageScroll(e) {
    this.data.tab0.mescroll && this.data.tab0.mescroll.onPageScroll(e);
    this.data.tab1.mescroll && this.data.tab1.mescroll.onPageScroll(e);
  },
  // mescroll组件初始化的回调,可获取到mescroll对象
  mescrollInit0(mescroll) {
    mescroll = mescroll.detail;
    mescroll.tabType = 0; // 加入标记,便于在回调中取到对应的list
    this.data.tab0.mescroll = mescroll;
  },
  mescrollInit1(mescroll) {
    mescroll = mescroll.detail;
    mescroll.tabType = 1;
    this.data.tab1.mescroll = mescroll;
  },
  getDownOption(tabType) {
    return {
      auto: tabType == 0, // 第一个mescroll传入true,列表自动加载
    }
  },
  getUpOption() {
    return {
      auto: false,
      // page: {
      // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
      // 	size: 10 // 每页数据的数量
      // },
      noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
      empty: {
        btnText: "去添加 +" //按钮,默认""
      }
    }
  },
  /*下拉刷新的回调*/
  downCallback(mescroll) {
    // 这里加载你想下拉刷新的数据, 比如刷新tab1的轮播数据
    mescroll = mescroll.detail;
    mescroll.resetUpScroll();// 触发下拉刷新的回调,加载第一页的数据
  },
  upCallback(mescroll) {
    mescroll = mescroll.detail;
    if (this.data.TabCur != mescroll.tabType) {
      mescroll.endErr(); // 只处理当前页的回调,避免tab切换过快,触发的回调和当前页不一致的问题
      return;
    }
    this.data.skip = mescroll.num - 1;
    this.data.limit = mescroll.size;
    this.getDataList(mescroll);
  },
  emptyClick: function (mescroll) {
    this.add();
  },
  // 获取菜单对应的数据
  getTabData(tabType) {
    if (tabType == 0) {
      return this.data.tab0;
    } else if (tabType == 1) {
      return this.data.tab1;
    } else if (tabType == 2) {
      return this.data.tab2;
    } else if (tabType == 3) {
      return this.data.tab3;
    }
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
    // this.setData({
    //   list: [],
    //   skip: 0,
    //   limit: perPage,
    //   allLoad: false,
    // })
    // this.getDataList();
    let data = this.data['tab' + this.data.TabCur];
    data.mescroll && data.mescroll.resetUpScroll();
  },

  getDataList: function (mescroll) {
    // debugger
    const db = wx.cloud.database();
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // console.log(111);6
    let data = this.data.pageDate;
    let logType = this.data.TabCur + '';
    let orderBy = 'creatTime';
    if (this.data.TabCur == 0) {
      orderBy = 'useDate';
    }
    // console.log(mescroll);
    // console.log(this.data['tab' + mescroll.tabType].isListInit)
    db.collection('record').orderBy(orderBy, 'desc').skip(this.data.skip).limit(this.data.limit).where({
      subClassId: data.subClassId,
      logType: logType
    }).get({
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // wx.hideLoading();
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            let date = item.useDate.replace(/-/g, '/')
            let startTime = new Date(`${date} ${item.useEndTime}`);
            let endTime = new Date(`${date} ${item.useStartTime}`);
            item.useTime = parseFloat((startTime - endTime) / (60 * 60 * 1000)).toFixed(2);
          })
          this.data['tab' + mescroll.tabType].isListInit = true;
          // debugger

          if (mescroll.num == 1) this.data['tab' + mescroll.tabType].list = [];
          // console.log(res.data);
          if (this.data.TabCur == 0) {
            res.data = this.proceessAdd(res.data);
          }
        }
        // console.log(res.data);

        this.data['tab' + mescroll.tabType].list = this.data['tab' + mescroll.tabType].list.concat(res.data);
        mescroll.endSuccess(res.data.length);
        if (mescroll.tabType == 0) {
          this.setData({
            tab0: this.data['tab' + mescroll.tabType]
          })
        } else if (mescroll.tabType == 1) {
          this.setData({
            tab1: this.data['tab' + mescroll.tabType]
          })
        }
        // debugger
        // console.log(this.data.tab0);
      },
      fail: err => {
        // wx.hideLoading();
        if (mescroll.num == 1) this.data.tab2.isListInit = false;
        this.setData({
          tab2: this.data.tab2
        })
        mescroll.endErr();//联网失败的回调,隐藏下拉刷新的状态
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
      }
    })
  },
  /**处理合并 */
  proceessAdd(data) {
    let firstDate = this.data.tab0.list.pop(), tempObj = null;
    let length = data.length, newList = [];
    var firstday = null, index = 0;
    if (firstDate && firstDate.list) {
      firstday = firstDate;
    } else {
      firstday = data[index];
      index = index + 1;
    }
    firstday.list = [];
    let haslast = false;
    // debugger
    while (index < length) {
      if (firstday.useDate === data[index].useDate) {
        firstday.list.push(data[index]);
      } else {
        newList.push(firstday);
        // tempObj = firstday;
        firstday = data[index];
        firstday.list = [];
        haslast = true;
      }
      index++;
    }
    // if (haslast || length === 1){
    newList.push(firstday);
    // }

    // console.log(newList);
    newList.forEach(item => {
      item.hasError = this.hasError(item);
    })
    // debugger
    return newList
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**有故障 */
  hasError(data) {
    let list = data.list.filter(item => item.useType == '2');
    // console.log(data);
    return data.useType == '2' || list.length > 0
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})