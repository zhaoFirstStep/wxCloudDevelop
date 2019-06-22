const app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    elements: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userStatus: null,
    list:[],
    modalName: null,
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
  
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行6
      // console.log(this.data.StatusBar);
      // console.log(app.globalData.userStatus)
      this.setData({
        userStatus: app.globalData.userStatus || null
      })
      
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      // console.log(4567);
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  methods:{
    //注册滚动到底部的事件,用于上拉加载
    onReachBottom() {
      // console.log(this.data.mescroll);
      // this.data.mescroll && this.data.mescroll.onReachBottom();
    },
    //注册列表滚动事件,用于下拉刷新
    onPageScroll(e) {
      this.data.mescroll && this.data.mescroll.onPageScroll(e);
    },
    delete(){
       this.showModal();
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
    reback(){
        app.globalData.userStatus = undefined;
        app.globalData.userInforObj = {};
        // wx.clearStorageSync();
        try{
          wx.removeStorageSync('userInforCount');
          var url = '../../login/index';
          // debugger
          if(this.data.userStatus){
            url ='../login/index';
          }
          wx.reLaunch({
            url: url,
          })
        }catch(e){

        }
        
    },
    getDataList(mescroll){
      const db = wx.cloud.database();
      // wx.showLoading({
      //   title: '加载中...',
      // })
      // console.log(111);6
      db.collection('classes').get({
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          //  console.log(res);
          // wx.hideLoading();
          // if (res.data && res.data.length > 0) {
          //   res.data.forEach(item => {
          //     item.shortName = item.name.substring(0, 1);
          //   })
          // }
          // for(var i=0;i<10;i++){
          //   res.data.push(res.data[0]);
          // }
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
    showModal(e) {
      // debugger
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
    delPresondb(data) {
      // console.log(data.imgid);
      //  console.log(data);
      wx.showLoading({
        title: '加载中...',
      });
      wx.cloud.callFunction({
         name:'deletClassfication',
         data:{
           id:data.id,
           imgId: data.imgid
         },
         success:res => {
          wx.hideLoading();
          wx.showToast({
              title: '删除成功'
          });
          // this.getDataList();
           this.data.mescroll.resetUpScroll();
          // console.log(res);
         },
         fail:res => {
           wx.hideLoading();
            wx.showToast({
              icon:'none',
              title: '删除失败',
            })
         }
      })
      //   wx.showLoading({
      //   title: '加载中...',
      // });
      
      // const db = wx.cloud.database();
      // const _id  = data.id;
      // db.collection('classes').doc(_id).remove({
      //   success: (res) => {
      //     wx.cloud.deleteFile({
      //       fileList: [data.6],
      //       success: res => {
      //         wx.hideLoading();
      //         wx.showToast({
      //           title: '删除成功'
      //         });
      //         this.getDataList();
      //       },
      //       fail:res=>{
      //         wx.hideLoading();
      //           wx.showToast({
      //             icon:'none',
      //             title: '图片删除失败，请联系管理员',
      //           })
      //       }
      //     })
      //   },
      //   fail: err => {
      //     wx.hideLoading();
      //     wx.showToast({
      //       icon: 'none',
      //       title: '删除失败'
      //     })
      //   }
      // })
    },
    gosubList(e){
      // console.log(e);
      let data = e.currentTarget.dataset;
      var url = '../subclassification/subclassification?id=';
      if(this.data.userStatus){
        url = '../classification/subclassification/subclassification?id=';
      }
      wx.navigateTo({
        url: url+ data.id + '&title=' + data.title,
      })
    },
    add(){
      wx.navigateTo({
        url: '../classification/addtype/addtype',
      })
    }
  }
})