// pages/profile/index.js
Page({
  data: {
    profile: {},
    loading: false
  },

  onLoad() {
    this.loadProfile();
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getUserProfile',
      success: function(res) {
        console.log('获取个人资料成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            profile: res.result.data || {},
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

  onEditTap() {
    wx.navigateTo({
      url: '/pages/profile-edit/index'
    });
  },

  onMyLikesTap() {
    wx.navigateTo({
      url: '/pages/mylikes/index'
    });
  },

  onLikesMeTap() {
    wx.navigateTo({
      url: '/pages/likesme/index'
    });
  }
});