// components/createOrder/createOrder.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    timetimeList: [],
    numSkip: 0,
  },
  created: function () {
    this.getList()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getList: function () {
      db.collection('timeTable').orderBy('date', 'asc').limit(8).get().then(res => {
        this.setData({
          timeList: res.data
        })
      }).catch(err => {
        console.error(err);
        wx.showToast({
          title: '网络连接不稳定，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
      })
    },
    next: function () {
      var num = this.data.numSkip
      num = num + 8
      db.collection('timeTable').orderBy('date', 'asc').skip(num).limit(8).get().then(res => {
        if (res.data.length != 0) {
          console.log("chagdua" + res.data.length);
          this.setData({
            timeList: res.data,
          })
        } else {
          num = num - 8
          wx.showToast({
            icon: "none",
            title: '没有更多了哦~',
          })
        }
        this.setData({
          numSkip: num
        })
      }).catch(err => {
        console.error(err);
        wx.showToast({
          title: '网络连接不稳定，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
      })
    },
    last: function () {
      // console.log("numSkip首先是" + this.data.numSkip)
      var num = this.data.numSkip
      if (num > 0) {
        num = num - 8

        db.collection('timeTable').orderBy('date', 'asc').skip(num).limit(8).get().then(res => {
          this.setData({
            timeList: res.data
          })
        }).catch(err => {
          console.error(err);
          wx.showToast({
            title: '网络连接不稳定，请检查网络连接',
            icon: 'none',
            duration: 2000
          })
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '已经是首页了哦',
        })
      }
      this.setData({
        numSkip: num
      })
    },
    look: function (event) {
      console.log(event);
      var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/details/details?id=' + id,
      });
    },
    update: function (event) {
      console.log(event);
      var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/update/update?id=' + id,
      });
    },
    /****
     * 
     * 删除数据
     * 
     */
    delete: function (event) {
      var that = this;
      Dialog.confirm({
        title: '标题',
        message: '是否确认删除？'
      }).then(() => {
        console.log(event);
        var id = event.currentTarget.dataset.id;
        wx.cloud.callFunction({
          name: "deleteData",
          data: {
            id: id
          }
        }).then(res => {
          this.getList()
          console.log("删除成功，刷新页面");
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.error(err);
          wx.showToast({
            title: '网络连接不稳定，请检查网络连接',
            icon: 'none',
            duration: 2000
          })
        })
      }).catch(() => {
        console.log('用户点击取消')
        wx.showToast({
          title: '删除取消',
          icon: 'none',
          duration: 2000
        })
      });
    },
  }
})