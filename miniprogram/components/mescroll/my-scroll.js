const app = getApp();
// 引入mescroll-uni.js,处理核心逻辑
import MeScroll from './scroll.js';
// 引入全局配置
import GlobalOption from './options.js';
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
    down: {
      type: Object,
      default: () => { }
    },
    up: {
      type: Object,
      default: () => { }
    },
    top: {
      type: [Number, String]
    },
    bottom: {
      type: [Number, String]
    },
    updateText: {
      type: String,
      value: '数据已更新'
    },
    updateCalss: {
      type: String,
      value: 'bg-gradual-pink'
    }
  },
  /**
   * 监听属性
   */
  observers: {
    'mescroll.optDown': function (down) {
      // let data = 
      // return down || null;
      // console.log(666);
      this.setData({
        optDown: down || null
      })
    },
    'mescroll.optUp': function (up) {
      // console.log(123);
      this.setData({
        optUp: up || null
      })
      // return this.data.mescroll ? this.data.mescroll.optDown : null;
    },
    'mescroll.optUp.empty': function (top) {
      // console.log(top);
      this.setData({
        optEmpty: top || null
      })
      // return this.data.mescroll ? this.data.mescroll.optDown : null;
    },
    'mescroll.optUp.toTop': function (bottom) {
      // console.log(bottom)
      this.setData({
        optToTop: bottom || null
      })
      // return this.data.mescroll ? this.data.mescroll.optDown : null;
    },
    'top': function (top) {
      this.setData({
        padTop: top || null
      })
    },
    'bottom': function (bottom) {
      this.setData({
        padBottom: bottom || null
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    optDown: null,// 下拉刷新的配置
    optUp: null,// 上拉加载的配置
    optEmpty: null,// 空布局的配置
    optToTop: null,// 回到顶部的配置
    padTop: 0,//padding-top的数值
    padBottom: 0,//padding-bottom的数值
    mescroll: null,
    downHight: 0, //下拉刷新: 容器高度
    downRotate: 0, //下拉刷新: 圆形进度条旋转的角度
    downText: '', //下拉刷新: 提示的文本
    isDownReset: false, //下拉刷新: 是否显示重置的过渡动画
    isDownLoading: false, //下拉刷新: 是否显示加载中
    isUpLoading: false, // 上拉加载: 是否显示 "加载中..."
    isUpNoMore: false, // 上拉加载: 是否显示 "-- END --"
    isShowEmpty: false, // 是否显示空布局
    isShowToTop: false, // 是否显示回到顶部按钮
    topTip: 'none',
    timeOutFunc: null
  },
  lifetimes: {
    attached() {
      let vm = this;

      let diyOption = {
        // 下拉刷新的配置
        down: {
          inOffset(mescroll) {
            // 下拉的距离进入offset范围内那一刻的回调
            // vm.isDownReset = false; // 不重置高度 (自定义mescroll组件时,此行不可删)
            // vm.isDownLoading = false; // 不显示加载中
            // vm.downText = mescroll.optDown.textInOffset; // 设置文本
            vm.setData({
              isDownReset: false,
              isDownLoading: false,
              downText: mescroll.optDown.textInOffset
            })
          },
          outOffset(mescroll) {
            // 下拉的距离大于offset那一刻的回调
            // vm.isDownReset = false; // 不重置高度 (自定义mescroll组件时,此行不可删)
            // vm.isDownLoading = false; // 不显示加载中
            // vm.downText = mescroll.optDown.textOutOffset; // 设置文本
            vm.setData({
              isDownReset: false,
              isDownLoading: false,
              downText: mescroll.optDown.textOutOffset
            })
          },
          onMoving(mescroll, rate, downHight) {
            // 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
            // vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
            // vm.downRotate = 360 * rate; // 设置旋转角度
            // console.log(666);
            vm.setData({
              downRotate: 360 * rate,
              downHight: downHight
            })
          },
          showLoading(mescroll, downHight) {
            // 显示下拉刷新进度的回调
            // vm.isDownReset = true; // 重置高度 (自定义mescroll组件时,此行不可删)
            // vm.isDownLoading = true;// 显示加载中
            // vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
            // vm.downText = mescroll.optDown.textLoading; // 设置文本
            // console.log(344);
            vm.setData({
              isDownReset: true,
              isDownLoading: true,
              downHight: downHight,
              downText: mescroll.optDown.textLoading
            })
          },
          endDownScroll(mescroll) {
            vm.setData({
              isDownReset: true,
              isDownLoading: false,
              downHight: 0
            })
            // vm.isDownReset = true;// 重置高度 (自定义mescroll组件时,此行不可删)
            // vm.isDownLoading = false; // 不显示加载中
            // vm.downHight = 0; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
          },
          // 派发下拉刷新的回调
          callback: function (mescroll) {
            vm.triggerEvent('down', mescroll)
          }
        },
        // 上拉加载的配置
        up: {
          // 显示加载中的回调
          showLoading() {
            // vm.isUpLoading = true;
            // vm.isUpNoMore = false;
            // console.log(999);
            vm.setData({
              isUpLoading: true,
              isUpNoMore: false
            })
          },
          // 显示无更多数据的回调
          showNoMore() {
            // vm.isUpLoading = false;
            // vm.isUpNoMore = true;
            vm.setData({
              isUpLoading: false,
              isUpNoMore: true
            })
          },
          // 隐藏上拉加载的回调
          hideUpScroll() {
            if (vm.timeOutFunc) {
              clearTimeout(vm.timeOutFunc);
              vm.timeOutFunc = null;
            }
            vm.setData({
              topTip: 'inline-block'
            })
            // console.log('刷新了');
            vm.timeOutFunc = setTimeout(() => {
              vm.setData({
                topTip: 'none'
              })
            }, 500)
            vm.setData({
              isUpLoading: false,
              isUpNoMore: false
            })
            // vm.isUpLoading = false;
            // vm.isUpNoMore = false;
          },
          // 空布局
          empty: {
            onShow(isShow) { // 显示隐藏的回调
              if (vm.isShowEmpty != isShow)
                vm.setData({
                  isShowEmpty: isShow
                })
              // vm.isShowEmpty = isShow;
            }
          },
          // 回到顶部
          toTop: {
            onShow(isShow) { // 显示隐藏的回调
              // console.log(777)
              if (vm.data.isShowToTop != isShow)
                vm.setData({
                  isShowToTop: isShow
                })
            }
          },
          // 派发上拉加载的回调
          callback: function (mescroll) {
            // console.log(111);
            vm.triggerEvent('up', mescroll)
          }
        }
      }

      MeScroll.extend(diyOption, GlobalOption); // 混入全局的配置
      let myOption = MeScroll.extend({
        'down': vm.data.down ? JSON.parse(JSON.stringify(vm.data.down)) : vm.data.down, // 深拷贝,避免对props的影响
        'up': vm.data.up ? JSON.parse(JSON.stringify(vm.data.up)) : vm.data.up // 深拷贝,避免对props的影响
      }, diyOption); // 混入具体界面的配置
      // debugger
      // console.log(vm.data.up);
      // 初始化MeScroll对象
      // console.log();
      vm.setData({
        mescroll: new MeScroll(myOption)
      })
      // vm.data.mescroll = new MeScroll(myOption);
      // init回调mescroll对象
      vm.triggerEvent('init', vm.data.mescroll);

      // 设置mescroll实例对象的body高度,使down的bottomOffset生效
      wx.getSystemInfo({
        success(res) {
          vm.data.mescroll.setBodyHeight(res.windowHeight);
        }
      });
    },
    detached() {

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //注册列表touchstart事件,用于下拉刷新
    touchstartEvent(e) {
      this.data.mescroll && this.data.mescroll.touchstartEvent(e);
    },
    //注册列表touchmove事件,用于下拉刷新
    touchmoveEvent(e) {
      this.data.mescroll && this.data.mescroll.touchmoveEvent(e);
    },
    //注册列表touchend事件,用于下拉刷新
    touchendEvent(e) {
      this.data.mescroll && this.data.mescroll.touchendEvent(e);
    },
    // 点击空布局的按钮回调
    emptyClick() {
      this.triggerEvent('emptyclick', this.data.mescroll)
    },
    // 点击回到顶部的按钮回调
    toTopClick() {
      this.setData({
        isShowToTop: false
      })
      // this.isShowToTop = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动
      wx.pageScrollTo({ // 执行回到顶部
        scrollTop: 0,
        duration: this.data.mescroll.optUp.toTop.duration
      });
      this.triggerEvent('topclick', this.data.mescroll) // 派发点击回到顶部按钮的回调
    }
  }
})