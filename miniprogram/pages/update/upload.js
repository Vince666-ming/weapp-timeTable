// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', // 发布的内容
    images: [], // 发布的图片
    fileIds: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: '',
    nickName: '',
    nowTime: '',
    zan: 0
  },
  previewImg: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.id // 需要预览的图片http链接列表
    })
  },
  submit: function() {
    wx.showLoading({
      title: '发表中',
    })
    // 发布图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: 'shareFiles/' + new Date().getTime() + suffix, // 发布至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          },
          fail: console.error
        })
      }));
    }

    Promise.all(promiseArr).then(res => {
      // 插入数据
      // if (this.data.fileIds == '') {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '请添加图片',
      //   })
      // } else {
        db.collection('shareData').add({
          data: {
            content: this.data.content,
            id: new Date().getTime(),
            fileIds: this.data.fileIds,
            nickName: this.data.nickName,
            avatarUrl: this.data.avatarUrl,
            nowTime: new Date().toLocaleString(),
            zan: this.data.zan,
            isZan: []
          }
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '发表成功',
          })
          wx.navigateBack({
            url: '../share/share'
          })
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '发表失败，检查网络连接',
          })
        })
      // }


    });

  },
  onContentChange: function(event) {
    this.setData({
      content: event.detail
    });
  },

  uploadImg: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log("文件路径temFilePaths：" + tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this
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
  },
  getUserInfo: function(e) {
    console.log(e)
    console.log(e.detail.userInfo.nickName)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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