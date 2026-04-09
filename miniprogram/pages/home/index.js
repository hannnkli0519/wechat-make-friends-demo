// pages/home/index.js
const { mockUsers } = require('../../utils/mockData');

Page({
  data: {
    userList: [],
    allUsers: [],
    filterConfig: {
      minAge: 18,
      maxAge: 40,
      cities: [],
      interests: []
    }
  },

  onLoad() {
    this.loadUsers();
  },

  onShow() {
    this.loadUsers();
  },

  loadUsers() {
    const app = getApp();
    const currentUserId = app.globalData.currentUserId;

    let storedUsers = wx.getStorageSync('recommendUsers') || mockUsers.slice();
    let likedUsers = wx.getStorageSync('likedUsers') || [];
    let skippedUsers = wx.getStorageSync('skippedUsers') || [];

    const likedIds = likedUsers.map(u => u.id);
    const skippedIds = skippedUsers.map(u => u.id);

    let filteredUsers = storedUsers.filter(user => {
      return !likedIds.includes(user.id) && !skippedIds.includes(user.id);
    });

    const filterConfig = this.data.filterConfig;
    if (filterConfig.minAge > 18 || filterConfig.maxAge < 40) {
      filteredUsers = filteredUsers.filter(user => {
        return user.age >= filterConfig.minAge && user.age <= filterConfig.maxAge;
      });
    }

    if (filterConfig.cities.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        return filterConfig.cities.includes(user.city);
      });
    }

    if (filterConfig.interests.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        return filterConfig.interests.some(tag => user.interests.includes(tag));
      });
    }

    this.setData({
      userList: filteredUsers,
      allUsers: storedUsers
    });
  },

  onLikeTap(e) {
    const userId = e.currentTarget.dataset.id;
    const { userList } = this.data;

    const user = userList.find(u => u.id === userId);
    if (!user) return;

    let likedUsers = wx.getStorageSync('likedUsers') || [];

    if (likedUsers.find(u => u.id === userId)) {
      wx.showToast({ title: '已经喜欢过了', icon: 'none' });
      return;
    }

    likedUsers.push({ ...user });
    wx.setStorageSync('likedUsers', likedUsers);

    let skippedUsers = wx.getStorageSync('skippedUsers') || [];
    skippedUsers.push({ id: userId });
    wx.setStorageSync('skippedUsers', skippedUsers);

    let profile = wx.getStorageSync('profile') || { visitors: 128, likes: 42, matches: 35 };
    profile.likes = (profile.likes || 0) + 1;

    if (user.likesMe) {
      profile.matches = (profile.matches || 0) + 1;

      let matchedUsers = wx.getStorageSync('matchedUsers') || [];
      if (!matchedUsers.find(u => u.id === userId)) {
        matchedUsers.push({ ...user });
        wx.setStorageSync('matchedUsers', matchedUsers);
      }

      wx.showToast({ title: '匹配成功！', icon: 'success' });
    } else {
      wx.showToast({ title: '已添加到我喜欢的', icon: 'success' });
    }

    wx.setStorageSync('profile', profile);

    let likesMeUsers = wx.getStorageSync('likesMeUsers') || mockUsers.filter(u => u.likesMe);
    likesMeUsers = likesMeUsers.filter(u => u.id !== userId);
    wx.setStorageSync('likesMeUsers', likesMeUsers);

    this.loadUsers();
  },

  onSkipTap(e) {
    const userId = e.currentTarget.dataset.id;

    let skippedUsers = wx.getStorageSync('skippedUsers') || [];
    skippedUsers.push({ id: userId });
    wx.setStorageSync('skippedUsers', skippedUsers);

    this.loadUsers();
  },

  onFilterTap() {
    wx.navigateTo({
      url: '/pages/filter/index'
    });
  },

  onScrollToLower() {
    console.log('滚动到底部，加载更多');
  }
});
