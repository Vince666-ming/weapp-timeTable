// components/nowWeather/nowWeather.js
Component({
  /**
   * 组件的属性列表
   */
  /**
   * 组件的初始数据
   */
  data: {
    location: [],
    weather: []
  },

  /**
   * 组件的方法列表
   */
  created: function (options) {
    this.getapi();
    // this.weatherweekday();
  },
  methods: {
    getapi: function () {
      var _this = this;
      // 获取IP地址
      wx.request({
        url: 'https://ip.tianqiapi.com/',
        data: {},
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          // 根据IP获取天气数据
          _this.setData({
            location: res.data
          });
          _this.weathertoday(res.data.ip);
          // _this.weatherweekday(res.data.ip)
        }
      });
    },
    // 天气api实况天气
    weathertoday: function (ip) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&appid=77118166&appsecret=wQ7NdnTF',
        data: {
          'ip': ip
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          _this.setData({
            weather: res.data
          });
          console.log(res.data)
        }
      });
    }
  }
})
