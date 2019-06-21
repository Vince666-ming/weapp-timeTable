Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [
      "https://www.vince666.cn/poster/poster-gaoKao.jpg",
      "https://www.vince666.cn/poster/poster-kaoYan.jpg",
      "https://www.vince666.cn/poster/poster-exercise.jpg",
      "https://www.vince666.cn/poster/poster-mo.jpg",
      "https://www.vince666.cn/poster/poster-vacation.jpg",
    ]
  },
  navBtn: function(e) {
    console.log(e);
    var id = e.currentTarget.id;
    if (id == "0") {
      wx.navigateTo({
        url: '/functions/gaoKao/gaoKao'
      })
    }
    if (id == "1") {
      wx.navigateTo({
        url: '/functions/kaoYan/kaoYan'
      })
    }
    if (id == "2") {
      wx.navigateTo({
        url: '/functions/exercise/exercise'
      })
    }
    if (id == "3") {
      wx.navigateTo({
        url: '/functions/mo/mo'
      })
    }
    if (id == "4") {
      wx.navigateTo({
        url: '/functions/vacation/vacation'
      })
    }
  }
})