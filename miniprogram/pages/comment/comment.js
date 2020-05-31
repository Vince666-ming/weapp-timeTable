// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    list: [],
    zan: 0,
    like: 0,
    userInfo: {},
    nickName: '',
    hasUserInfo: false,
    yes_url: '/pages/logs/bar/like.png',
    no_url: '/pages/logs/bar/like@dis.png',
    yes_col: '/pages/logs/bar/collect.png',
    no_col: '/pages/logs/bar/collect@dis.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    comment: '',
    id: '',
    event:''
  },
  previewImg: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.id // 需要预览的图片http链接列表
    })
  },

  inputConmment(event) {
    this.setData({
      comment: event.detail
    });
  },
  submit: function() {
    var that = this
    if (this.data.comment == '') {
      wx.showToast({
        icon: 'none',
        title: '还没有输入文字哦~',
      })
    } else {
      const _ = db.command
      const aaa = db.command
      wx.cloud.callFunction({
        name: 'comment',
        data: { 
          commentId: this.data.id,
          commentName: this.data.nickName,
          commentText: this.data.comment
          },
      }).then(res => {
        console.log(res);
        wx.showToast({
          title: '评论成功',
        })
        this.onLoad(this.data.event)
        }).catch(err => {
          console.error(err);
          wx.showToast({
            title: '网络连接不稳定，请检查网络连接',
            icon: 'none',
            duration: 2000
          })
        })
    }
    
  },
  onLike: function(e) {
    const aa = db.command;
    const bb = db.command;
    if (this.data.like == 0) {
      db.collection('shareData').doc(e.currentTarget.dataset.id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          zan: aa.inc(1)
        },
        success(res) {

          console.log("点赞成功")
        }
      })
      this.setData({
        like: this.data.like + 1,
        zan: 1
      })
    }
    // else{console.log("不能取消点赞")}
    else {
      db.collection('shareData').doc(e.currentTarget.dataset.id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          zan: bb.inc(-1)
        },
        success(res) {

          console.log("取消点赞")
        }
      })
      this.setData({
        like: this.data.like - 1,
        zan: 0
      })

    }

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
    db.collection('collection').where({
      fileIds: e.currentTarget.dataset.id[0]
    }).get().then(res => {
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
            fileIds: e.currentTarget.dataset.id[0]
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
            this.setData({
              collect: 1
            })
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this
    this.setData({
      id: e.id,
      event:e
    })
    // var event=e;
    // console.log(event)
    console.log("id是" + this.data.id)
    wx.getUserInfo({
      success :res => {
        console.log(res.userInfo)
        // if(res.userInfo)
        that.setData({
          nickName:res.userInfo.nickName,
          avatarUrl:res.userInfo.avatarUrl,
          hasUserInfo:true
        })
      },
      fail:err=>{
          console.log(err)
      }
    })
    db.collection('shareData').doc(e.id).get().then(res => {
      // console.log(res.data)
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
  },
  getUserInfo: function(e) {
    // console.log(e)
    // console.log(e.detail.userInfo.nickName)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      nickName: e.detail.userInfo.nickName,
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.onLoad(e);
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
    // this.onLoad();
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