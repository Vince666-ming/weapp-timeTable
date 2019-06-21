//index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({
  data: {

  },
  // 页签切换
  onClick(event) {
    wx.showToast({
      title: `计划表 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },
  onLoad: function(options) {
    // Dialog.alert({
    //   title: '标题',
    //   message: '弹窗内容'
    // }).then(() => {
    //   // on close
    // });
  }
})