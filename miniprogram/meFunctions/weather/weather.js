// components/nowWeather/nowWeather.js
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

    weather: [], //实况天气
    weatherweek: [], //七日天气
  },

  /**
   * 组件的方法列表
   */
  created: function(options) {
    this.getapi();
    // this.weatherweekday();
  },
  methods: {
    getapi: function() {
      var _this = this;
      // 获取IP地址
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&cityid=101110101&appid=77118166&appsecret=wQ7NdnTF',
        data: {},
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res);
          // 根据IP获取天气数据
          _this.weathertoday(res.data.ip);
          _this.weatherweekday(res.data.ip)
        }
      });
    },
    // 天气api实况天气
    weathertoday: function(ip) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v6&cityid=101110101&appid=77118166&appsecret=wQ7NdnTF',
        
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          _this.setData({
            weather: res.data
          });
          console.log(_this.data.weather)
        }
      });
    },
    // 天气api一周天气
    weatherweekday: function(ip) {
      var _this = this;
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v1&cityid=101110101&appid=77118166&appsecret=wQ7NdnTF',
        
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          _this.setData({
            weatherweek: res.data
          });
          console.log(_this.data.weatherweek)
        }
      });
    }
  }
})