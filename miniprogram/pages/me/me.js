// pages/me/me.js
const app = getApp()
Page({

  data: {},
  weather: function(e) {
    wx.navigateTo({
      url: '/meFunctions/weather/weather'
    })
  },
  //事件处理函数
  onLoad: function() {

  },


})