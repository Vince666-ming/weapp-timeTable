// com/aa.js
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
    list: [],
    numSkip: 0,
    imgUrl: '',
    openid: ''
    //  filee:[]
  },
  created: function () {
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('work').orderBy('content', 'asc').limit(5).get().then(res => {
      wx.hideLoading()
      // console.log(res.data)
      this.setData({
        list: res.data
      })
    }).catch(err => {
      console.error(err);
      wx.hideLoading()
      wx.showToast({
        title: '网络连接不稳定，请检查网络连接',
        icon: 'none',
        duration: 2000
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    saveDoc: function (e) {
      console.log(e.currentTarget.dataset.id)
      wx.setClipboardData({
        //准备复制的数据
        data: e.currentTarget.dataset.id,
        success: function (res) {
          wx.hideToast();
          Dialog.alert({
            title: '下载链接已复制到剪贴板！',
            message: '将复制的链接粘贴至电脑浏览器即可开始下载'
          })
        }
      })
    },
    savePicture: function (e) {
      var that = this;
      // console.log(e);
      console.log("fileID是：" + e.currentTarget.dataset.id[0]);
      wx.cloud.getTempFileURL({
        fileList: [e.currentTarget.dataset.id[0]],
        success: res => {
          // get temp file URL
          console.log("文件url地址：" + res.fileList[0].tempFileURL)
          this.setData({
            imgUrl: res.fileList[0].tempFileURL
          })
          wx.showLoading({
            title: '保存中...'
          })
          wx.downloadFile({
            url: this.data.imgUrl,
            success: function (res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.hideLoading()
                  Dialog.alert({
                    title: '提示',
                    message: '保存成功！'
                  })
                },
                fail: function (err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                    wx.showModal({
                      title: '提示',
                      content: '需要您授权保存相册',
                      showCancel: false,
                      success: modalSuccess => {
                        wx.openSetting({
                          success(settingdata) {
                            console.log("settingdata", settingdata)
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次点击图片即可保存',
                                showCancel: false,
                              })
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存到相册哦~',
                                showCancel: false,
                              })
                            }
                          },
                          fail(failData) {
                            console.log("failData", failData)
                          },
                          complete(finishData) {
                            console.log("finishData", finishData)
                          }
                        })
                      }
                    })
                  }
                },
                complete(res) {
                  wx.hideLoading()
                }
              })
            }
          })
        },
        fail: err => {
          console.log(error)
          // handle error
        }
      })
    },
    previewImg: function (e) {
      // console.log(e)
      wx.previewImage({
        current: e.currentTarget.dataset.id, // 当前显示图片的http链接
        urls: e.currentTarget.dataset.id // 需要预览的图片http链接列表
      })
    },
    next: function () {
      wx.showLoading({
        title: '加载中...',
      })
      var num = this.data.numSkip
      num = num + 5;
      db.collection('work').orderBy('content', 'asc').skip(num).limit(5).get().then(res => {
        wx.hideLoading()
        if (res.data.length != 0) {
          console.log(res);
          this.setData({
            list: res.data,
          })
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          num = num - 5
          wx.showToast({
            icon: "none",
            title: '暂无更多内容~',
          })
        }
        this.setData({
          numSkip: num
        })
      }).catch(err => {
        console.error(err);
        wx.hideLoading()
        wx.showToast({
          title: '网络连接不稳定，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
      })
    },
    last: function () {
      var num = this.data.numSkip
      wx.showLoading({
        title: '加载中...',
      })
      if (num > 5) {
        num = num - 5
        db.collection('work').orderBy('content', 'asc').skip(num).limit(5).get().then(res => {
          wx.hideLoading()
          this.setData({
            list: res.data
          })
        })
      } else if (num == 5) {
        num = num - 5
        db.collection('work').orderBy('content', 'asc').limit(5).get().then(res => {
          wx.hideLoading()
          this.setData({
            list: res.data
          })
        }).catch(err => {
          console.error(err);
          wx.hideLoading()
          wx.showToast({
            title: '网络连接不稳定，请检查网络连接',
            icon: 'none',
            duration: 2000
          })
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '已经是首页了哦',
        })
      }
      this.setData({
        numSkip: num
      })
    },
  }
})