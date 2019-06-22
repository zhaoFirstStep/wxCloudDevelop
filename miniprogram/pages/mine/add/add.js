// pages/mine/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:'',
     name:'',
     text:'',
     username:'',
     password:'',
     alert:{
       title:'错误提示',
       modelName:null,
       message:''
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  console.log(options);
    this.setData({
      id: options.id||''
    })
    if(this.data.id){
      this.getUserInfor();
    }
  },
  /**获取用户信息 */
  getUserInfor:function(){
    const db = wx.cloud.database();
    wx.showLoading({
      title: '查询中...',
    })
    db.collection('member').doc(this.data.id).get({
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
         console.log(res);
        wx.hideLoading();
        if (res.data) {
           let {_id, name, text, username, password} = res.data;
          //  console.log()
           this.setData({
              id:_id,
              name:name,
              text:text,
              username:username || '',
              password:password || ''
           })
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
      }
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
   * 取消
   */
  cancel:function() {
    console.log(111);
    wx.navigateBack({
      delta: 1
    });
  },
  /**更新数据 */
  updateData:function(data){
    const db = wx.cloud.database();
    wx.showLoading({
      title: '保存中...',
    })
    // console.log(data.id);
    db.collection('member').doc(data.id).update({data,success:res=>{
      wx.hideLoading();
        wx.showToast({
          title: '保存成功'
        })
        this.cancel();
    },
    fail:res=>{
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '保存失败'
      })
    }
    })
  },
  /**
   * 保存数据
   */
  saveDate:function(e){
    // console.log(name,text);
    if(!this.data.name){
      wx.showToast({
        icon: 'none',
        title: '请填写人员名称'
      })
      return
    }
    if (!this.data.username) {
      wx.showToast({
        icon: 'none',
        title: '请填写用户名'
      })
      return
    }
    if (!this.data.password) {
      wx.showToast({
        icon: 'none',
        title: '请填写密码'
      })
      return
    }
    let {id, name,text,password,username} = this.data;
    if(id){
      this.updateData({ id, name, text, password, username });
      return
    }
    this.onAdd({ name, text, password, username});
  },
  /**
   * 新增数据
   */
  onAdd: function (data) {
    const db = wx.cloud.database();
    db.collection('member').add({
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
          title: '新增人员失败'
        })
      }
    })
  },
  /**
   * 隐藏弹窗
   */
  hideModal:function(e){
      this.data.alert.modelName = null;
    this.setData({alert: this.data.alert});
  },
  /**
   * 数据变动
   */
  input:function(e){
     let key = e.currentTarget.dataset.name;
    let value = e.detail.value.trim();
    this.data[key] = value;
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