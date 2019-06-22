// pages/classification/addtype/addtype.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgList: [],
    typeName:'',
    desc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
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
   * 数据变动
   */
  input: function (e) {
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value.trim();
    this.data[key] = value;
  },
  /**
   * 保存图片
   */
  saveType(e){
     let {typeName,desc,imgList} = this.data;
    //  console.log({ typeName, desc, imgList });
    if (!typeName){
      wx.showToast({
        icon: 'none',
        title: '请填写类别名称'
      })
      return
    }
    if (imgList.length===0){
      wx.showToast({
        icon: 'none',
        title: '请选择图片'
      })
      return
    }
    this.saveTypedb({ typeName, desc, imgList });
  },
  /**
   * 保存数据库调用
   */
  saveTypedb(data){
        wx.showLoading({
          title: '保存中',
        })

    const filePath = data.imgList[0];
        // 上传图片
        const cloudPath = 'my-image'+ Date.now() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // console.log('[上传文件] 成功：', res)
            data.imgUrl = res.fileID; 
            const db = wx.cloud.database();
            db.collection("classes").add({
              data: data,
              success: res => {
                wx.showToast({
                  title: '保存成功!',
                  'icon': 'none'
                })
                this.cancel();
              },
              fail: err => {
                wx.showToast({
                  title: '保存失败，请稍后再试',
                  'icon': 'none'
                })
              }
            });
          },
          fail: e => {
            // console.error('[上传文件] 失败：', e)
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            
          }
        })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
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