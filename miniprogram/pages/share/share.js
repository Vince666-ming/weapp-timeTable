const db = wx.cloud.database();
Page({
  // 每次点击赞的时候都查找openid是否已经存在，如果已经存在，提示已经点过赞了，如果不存在，add zan 并push openid进 iszan，
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    numSkip: 0,
    imgUrl: '',
    like: 0,
    collect: 0,
    zan: 0,
    openid: ''
    //  filee:[]
  },
  previewImg:function(e){
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
      // console.log(res.result.openId);
      var openid = res.result.openId;
      const _ = db.command;
      db.collection('shareData').doc(e.currentTarget.dataset.id).get().then(res => {
        // console.log(res)
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
        // console.log("haveZan" + haveZan)
        if (haveZan == '') {
          wx.cloud.callFunction({
            name: 'like',
            data: {
              shareId: e.currentTarget.dataset.id
            },
          }).then(res => {
            // 局部刷新要判断页码
            wx.showLoading({
              title: '加载中...',
            })
            db.collection('shareData').orderBy('id', 'desc').skip(this.data.numSkip).limit(5).get().then(res => {
              // console.log(res.data)
              this.setData({
                list: res.data
              })
              wx.hideLoading();
            }).catch(err => {
              console.error(err);
              wx.hideLoading();
              wx.showToast({
                title: '网络连接不稳定，请检查网络连接',
                icon: 'none',
                duration: 2000
              })
            })
            console.log("点赞成功")
          })
        }
      })
    })
  },
  next: function () {
    var num = this.data.numSkip
    num = num + 5;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('shareData').orderBy('id', 'desc').skip(num).limit(5).get().then(res => {
      wx.hideLoading();
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
      db.collection('shareData').orderBy('id', 'desc').skip(num).limit(5).get().then(res => {
        this.setData({
          list: res.data
        })
      })
    } else if (num == 5) {
      num = num - 5
      db.collection('shareData').orderBy('id', 'desc').limit(5).get().then(res => {
        wx.hideLoading()
        this.setData({
          list: res.data
        })
      }).catch(err => {
        console.error(err);
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
  onLoad: function(options) {
    // var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('shareData').orderBy('id', 'desc').limit(5).get().then(res => {
      // console.log(res.data)
      this.setData({
        list: res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '网络连接不稳定，请检查网络连接',
        icon: 'none',
        duration: 2000
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
  onCollect: function(e) {
    // console.log(e.currentTarget.dataset.id)
    var addData = e.currentTarget.dataset.id;
    db.collection('collection').where({
      colId: addData._id
    }).get().then(res => {
      // console.log(res)
      if (res.data.length != 0)
        wx.showModal({
          title: '这张时间表已经收藏过啦！',
          content: '是否前往我的收藏列表',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../myCollection/myCollection'
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      else {
        db.collection('collection').add({
          data: {
            colId: addData._id
          },
          success: res => {
            // console.log(res);
            wx.showModal({
              title: '收藏成功',
              content: '是否前往我的收藏列表',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/myCollection/myCollection'
                  })
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
      }
    })
  },
  goToComment: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../comment/comment?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
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
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.next()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})