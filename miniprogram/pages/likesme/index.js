// pages/likesme/index.js
Page({
  data: {
    likesMeList: []
  },

  onShow() {
    this.loadLikesMe();
  },

  loadLikesMe() {
    // 从本地存储获取喜欢我的用户
    let likesMeUsers = wx.getStorageSync('likesMeUsers');

    // 如果没有存储的数据，使用模拟数据
    if (!likesMeUsers || likesMeUsers.length === 0) {
      const { mockUsers } = require('../../utils/mockData');
      likesMeUsers = mockUsers.filter(u => u.likesMe);
      wx.setStorageSync('likesMeUsers', likesMeUsers);
    }

    this.setData({ likesMeList: likesMeUsers });
  },

  // 回应喜欢
  onRespondTap(e) {
    const userId = e.currentTarget.dataset.id;
    const userName = e.currentTarget.dataset.name;

    // 获取该用户信息
    const user = this.data.likesMeList.find(u => u.id === userId);
    if (!user) return;

    // 从喜欢我的列表中移除
    const newList = this.data.likesMeList.filter(u => u.id !== userId);
    wx.setStorageSync('likesMeUsers', newList);

    // 添加到喜欢列表（双向喜欢 = 匹配）
    let likedUsers = wx.getStorageSync('likedUsers') || [];
    if (!likedUsers.find(u => u.id === userId)) {
      likedUsers.push({ ...user });
      wx.setStorageSync('likedUsers', likedUsers);
    }

    // 添加到匹配列表
    let matchedUsers = wx.getStorageSync('matchedUsers') || [];
    if (!matchedUsers.find(u => u.id === userId)) {
      matchedUsers.push({ ...user });
      wx.setStorageSync('matchedUsers', matchedUsers);
    }

    // 更新 profile 的匹配数
    let profile = wx.getStorageSync('profile') || { visitors: 128, likes: 42, matches: 35 };
    profile.matches = (profile.matches || 0) + 1;
    profile.likes = (profile.likes || 0) + 1;
    wx.setStorageSync('profile', profile);

    // 更新当前列表
    this.setData({ likesMeList: newList });

    // 显示匹配成功提示
    wx.showModal({
      title: '匹配成功',
      content: `已与 ${userName} 匹配成功！可以在消息页面开始聊天了`,
      showCancel: false,
      confirmText: '去聊天',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/messages/index'
          });
        }
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
});
