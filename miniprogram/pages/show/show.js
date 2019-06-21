// pages/template/template.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    timeList: [],
    latest: '0'
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    db.collection('timeTable').orderBy('id', 'desc').limit(1).get().then(res => {
      console.log(res);
      this.setData({
        timeList: res.data
      })
    })

  },
})