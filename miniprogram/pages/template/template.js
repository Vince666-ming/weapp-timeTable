Page({
  data: {
    navs: []
  },
  onLoad: function(options) {
    var page = this;
    var navs = this.loadNavData();
    page.setData({
      navs: navs
    });
  },
  navBtn: function(e) {
    console.log(e);
    var id = e.currentTarget.id;
    if (id == "0") {
      wx.navigateTo({
        url: '/functions/kaoYan/kaoYan'
      })
    } else if (id == "1") {
      wx.navigateTo({
        url: '/functions/exercise/exercise'
      })
    } else if (id == "2") {
      wx.navigateTo({
        url: '/functions/university/university'
      })
    } else if (id == "3") {
      wx.navigateTo({
        url: '/functions/work/work'
      })
    } else if (id == "4") {
      wx.navigateTo({
        url: '/functions/gaoKao/gaoKao'
      })
    } else if (id == "5") {
      wx.navigateTo({
        url: '/functions/vacation/vacation'
      })
    } else if (id == "6") {
      wx.navigateTo({
        url: '/functions/highSchool/highSchool'
      })
    } else if (id == "7") {
      wx.navigateTo({
        url: '/functions/dayTemplate/dayTemplate'
      })
    } else if (id == "8") {
      wx.navigateTo({
        url: '/functions/moTemplate/moTemplate'
      })
    } else if (id == "9") {
      wx.navigateTo({
        url: '/functions/weekTemplate/weekTemplate'
      })
    } else if (id == "10") {
      wx.navigateTo({
        url: '/functions/more/more'
      })
    }
  },
  loadNavData: function() {
    var navs = [];
    var nav0 = new Object();
    nav0.img = '/pages/logs/functions/kaoYan.jpg';
    nav0.name = '考研';
    nav0.width = '19';
    nav0.height = '22';
    navs[0] = nav0;

    var nav1 = new Object();
    nav1.img = '/pages/logs/functions/exercise.jpg';
    nav1.name = '健身';
    nav1.width = '20';
    nav1.height = '20';
    navs[1] = nav1;

    var nav2 = new Object();
    nav2.img = '/pages/logs/functions/university.jpg';
    nav2.name = '大学';
    nav2.width = '23';
    nav2.height = '25';
    navs[2] = nav2;

    var nav3 = new Object();
    nav3.img = '/pages/logs/functions/work.jpg';
    nav3.name = '工作';
    nav3.width = '18';
    nav3.height = '23';
    navs[3] = nav3;

    var nav4 = new Object();
    nav4.img = '/pages/logs/functions/gaoKao.jpg';
    nav4.name = '高考';
    nav4.width = '23';
    nav4.height = '22';
    navs[4] = nav4;

    var nav5 = new Object();
    nav5.img = '/pages/logs/functions/vacation.jpg';
    nav5.name = '假期';
    nav5.width = '21';
    nav5.height = '17';
    navs[5] = nav5;

    var nav6 = new Object();
    nav6.img = '/pages/logs/functions/highSchool.jpg';
    nav6.name = '中小学';
    nav6.width = '21';
    nav6.height = '23';
    navs[6] = nav6;

    var nav7 = new Object();
    nav7.img = '/pages/logs/functions/dayTemplate.jpg';
    nav7.name = '日表';
    nav7.width = '21';
    nav7.height = '23';
    navs[7] = nav7;

    var nav8 = new Object();
    nav8.img = '/pages/logs/functions/moTemplate.jpg';
    nav8.name = '周末表';
    nav8.width = '21';
    nav8.height = '23';
    navs[8] = nav8;

    var nav9 = new Object();
    nav9.img = '/pages/logs/functions/weekTemplate.jpg';
    nav9.name = '周表';
    nav9.width = '21';
    nav9.height = '23';
    navs[9] = nav9;

    var nav10 = new Object();
    nav10.img = '/pages/logs/functions/more.jpg';
    nav10.name = '更多';
    nav10.width = '18';
    nav10.height = '21';
    navs[10] = nav10;

    return navs;
  }
})