// pages/classification/addsubclassification/addsubclassification.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    machineCode: '',
    pageDate:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.pageDate = options;
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
   * 保存子类型
   */
  saveSubClass(e){
    // console.log(this.data);
    let data = {};
    data.machineCode = this.data.machineCode;
    data.parentId = this.data.pageDate.parentId;
    data.isError = false;
    if (!this.data.machineCode) {
      wx.showToast({
        icon: 'none',
        title: '请填写机器编码'
      })
      return
    }
    const db = wx.cloud.database();
    db.collection('subclass').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增成功',
        })
        this.cancel();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增失败'
        })
      }
    })
  },
  /**
   * 数据变动
   */
  input: function (e) {
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value.trim();
    this.data[key] = value;
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