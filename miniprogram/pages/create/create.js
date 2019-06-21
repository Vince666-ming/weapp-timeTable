// pages/index/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    clear: ''
  },
  delete: function () {
    this.setData({
      clear: ''
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  submit: function (e) {
    // console.log(e.detail.value.date)
    db.collection('timeTable').add({
      data: {
        date: e.detail.value.date,
        six: e.detail.value.six,
        sixDetails: e.detail.value.sixDetails,
        seven: e.detail.value.seven,
        sevenDetails: e.detail.value.sevenDetails,
        eight: e.detail.value.eight,
        eightDetails: e.detail.value.eightDetails,
        nine: e.detail.value.nine,
        nineDetails: e.detail.value.nineDetails,
        ten: e.detail.value.ten,
        tenDetails: e.detail.value.tenDetails,
        eleven: e.detail.value.eleven,
        elevenDetails: e.detail.value.elevenDetails,
        twelve: e.detail.value.twelve,
        twelveDetails: e.detail.value.twelveDetails,
        thirteen: e.detail.value.thirteen,
        thirteenDetails: e.detail.value.thirteenDetails,
        fourteen: e.detail.value.fourteen,
        fourteenDetails: e.detail.value.fourteenDetails,
        fifteen: e.detail.value.fifteen,
        fifteenDetails: e.detail.value.fifteenDetails,
        sixteen: e.detail.value.sixteen,
        sixteenDetails: e.detail.value.sixteenDetails,
        seventeen: e.detail.value.seventeen,
        seventeenDetails: e.detail.value.seventeenDetails,
        eighteen: e.detail.value.eighteen,
        eighteenDetails: e.detail.value.eighteenDetails,
        nineteen: e.detail.value.nineteen,
        nineteenDetails: e.detail.value.nineteenDetails,
        twenty: e.detail.value.twenty,
        twentyDetails: e.detail.value.twentyDetails,
        twenty1: e.detail.value.twenty1,
        twenty1Details: e.detail.value.twenty1Details,
        twenty2: e.detail.value.twenty2,
        twenty2Details: e.detail.value.twenty2Details,
        twenty3: e.detail.value.twenty3,
        twenty3Details: e.detail.value.twenty3Details,
        twenty4: e.detail.value.twenty4,
        twenty4Details: e.detail.value.twenty4Details,
        remarks: e.detail.value.remarks,
        id: new Date().getTime()
      },
      success: res => {
        // console.log(res);
        console.log("导入数据库成功");
        wx.showModal({
          title: '创建成功',
          content: '是否立即查看',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../show/show'
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var year = date.getFullYear();
    //获取月份  
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      date: year + '-' + month + '-' + day
    })
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