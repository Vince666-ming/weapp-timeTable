// pages/myCollection/myCollection.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numSkip: 0,
    imgUrl: '',
    col: [],
    list: [],
    colList: [],
    zan: 0,
    like: 0
  },
  previewImg: function(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.id // 需要预览的图片http链接列表
    })
  },

  onLike: function(e) {
    // 获取openID
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => {
      console.log(res.result.openId);
      var openid = res.result.openId;
      const _ = db.command;
      db.collection('shareData').doc(e.currentTarget.dataset.id).get().then(res => {
        console.log(res)
        var haveZan = ''
        for (var i = 0; i < res.data.isZan.length; i++) {
          // 如果openid存在于iszan中
          if (res.data.isZan[i] == openid) {
            haveZan = openid
            console.log("重复点赞")
            wx.showToast({
              icon: 'none',
              title: '这条已经点过赞了哦',
            })
          }
        }
        console.log("haveZan" + haveZan)
        if (haveZan == '') {
          wx.cloud.callFunction({
            name: 'like',
            data: {
              shareId: e.currentTarget.dataset.id
            },
          }).then(res => {
            this.onLoad();
            console.log("点赞成功")
          })
        }
      })
    })
  },
  saveImg: function(e) {
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
          success: function(res) {
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(data) {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '  保存成功！',
                  showCancel: false,
                })
              },
              fail: function(err) {
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
  disCollect: function(e) {
    var that=this;
    console.log("取消收藏ID：" + e.currentTarget.dataset.id)
    Dialog.confirm({
      title: '提示',
      message: '是否确认取消收藏？'
    }).then(() => {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'delCollect',
        // 传给云函数的参数
        data: {
          a: e.currentTarget.dataset.id
        }
      }).then(res => {
        // that.getList()
        wx.showToast({
          title: '取消收藏成功',
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
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getList(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    db.collection('collection').get({
      success(res) {
        wx.hideLoading()
        for (var i = 0; i < res.data.length; i++) {
          db.collection('shareData').where({
            _id: res.data[i].colId
          }).get().then(res => {
            // console.log(res.data)
            that.setData({
              list: that.data.list.concat(res.data)
            });
          })
        }

      },
      fail(res) {
        wx.hideLoading()
        console.log("fail", res)
      },
    })
  },
  onLoad: function() {
    this.getList();
  },
  goToComment: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../comment/comment?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})