// pages/mylikes/index.js
Page({
  data: {
    myLikesList: [],
    loading: false
  },

  onShow() {
    this.loadMyLikes();
  },

  loadMyLikes() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getMyLikes',
      success: function(res) {
        console.log('获取我喜欢的列表成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            myLikesList: res.result.data || [],
            loading: false
          });
        } else {
          console.error('获取失败:', res.result.message);
          wx.showToast({ title: '加载失败', icon: 'none' });
          that.setData({ loading: false });
        }
      },
      fail: function(err) {
        console.error('调用云函数失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ loading: false });
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
});