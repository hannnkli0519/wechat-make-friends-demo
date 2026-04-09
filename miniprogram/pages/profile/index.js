// pages/profile/index.js
const { mockProfile } = require('../../utils/mockData');

Page({
  data: {
    profile: {}
  },

  onLoad() {
    this.loadProfile();
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    let profile = wx.getStorageSync('profile');
    if (!profile) {
      profile = { ...mockProfile };
      wx.setStorageSync('profile', profile);
    }

    const likedUsers = wx.getStorageSync('likedUsers') || [];
    const matchedUsers = wx.getStorageSync('matchedUsers') || [];

    profile.likes = likedUsers.length;
    profile.matches = matchedUsers.length;

    this.setData({ profile });
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
