// pages/classification/subadd/subadd.js
var util = require('../../../utils/index.js');
const app = getApp();
// console.log(util);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '12:01',
    date: '2018-12-25',
    PageCur:'',
    fromData:{
      name: '',
      inspectionDate: util.parseTime(new Date(),'{y}-{m}-{d}'),//巡查日期
      inspectionTime:'09:00',//巡检时间
      useDate: util.parseTime(new Date(), '{y}-{m}-{d}'),//使用日期
      useStartTime:'09:00',
      useEndTime:'16:00',
      isClean:true,//是否清洗
      isSelfCheck: true,//是否自检
      useType:'1',//使用类型
      desc:'',//描述
    },
    useType:[
      {
        name:'良好',
        value:'1'
      },
      {
        name: '故障',
        value: '2'
      },
      {
        name: '其他',
        value: '3'
      }
    ],
    pageDate:{}
  },
  /**
* 取消
*/
  cancel: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 变动是否清洗
   */
  switchChange(e){
      // console.log(e);
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value;
    this.data.fromData[key] = value;
    this.setData({
      fromData: this.data.fromData
    })
  },
  /**
   * 数据变动6666666666666666666666666666
   */
  input: function (e) {
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value.trim();
    this.data.fromData[key] = value;
    this.setData({
      fromData:this.data.fromData
    })
  },
  saveResultData(){
    //  console.log(this.data.fromData);
     let data = this.data.fromData;
     data = Object.assign(data, this.data.pageDate);
    // console.log(this.data.pageDate);
    if(!data.name){
      wx.showToast({
        icon: 'none',
        title: '请签名'
      })
      return
    }
    if (!data.useType && data.logType==0) {
      wx.showToast({
        icon: 'none',
        title: '请选择使用记录'
      })
      return
    }

    //  console.log(data);
    wx.showLoading({
      title: '加载中...',
    });
    // console.log(data.id);
    wx.cloud.callFunction({
      name: 'savelog',
      data: data,
      success: res => {
        // console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '保存成功'
        });
       this.cancel();
      },
      fail: res => {
        // console.log(res);
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '保存失败,请稍后再试！',
        })
      }
    })
  },
  // TimeChange(e) {
  //   this.setData({
  //     time: e.detail.value
  //   })
  // },

  // DateChange(e) {
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },

  onMyEvent(e){
    
    let data = e.detail;
    let fromData = Object.assign({}, this.data.fromData);
    // console.log(fromData);
    fromData.name = data.name;
    this.setData({
      PageCur: null,
      choosePerson:false,
      fromData: fromData
    })
  },

  choosePerson(e){
    this.setData({
      PageCur: 'mine',
      choosePerson:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.pageDate = options;
    this.data.fromData.name = app.globalData.userInforObj.name;
    this.setData({
      pageDate: this.data.pageDate,
      fromData: this.data.fromData
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
    // console.log('show');
    if(this.data.choosePerson){
      this.choosePerson();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //  console.log('hidden');
    this.setData({
      PageCur: null
    })
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