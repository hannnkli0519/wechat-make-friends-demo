// pages/mylikes/index.js
Page({
  data: {
    myLikesList: []
  },

  onShow() {
    this.loadMyLikes();
  },

  loadMyLikes() {
    const likedUsers = wx.getStorageSync('likedUsers') || [];
    this.setData({ myLikesList: likedUsers });
  },

  onBack() {
    wx.navigateBack();
  }
});
