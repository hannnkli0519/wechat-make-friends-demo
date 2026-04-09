// pages/profile-edit/index.js
const { mockProfile, mockInterests } = require('../../utils/mockData');

Page({
  data: {
    profile: {},
    interestOptions: []
  },

  onLoad() {
    const profile = wx.getStorageSync('profile') || { ...mockProfile };
    this.setData({ profile });

    // 初始化兴趣选项
    const interestOptions = mockInterests.map(name => ({
      name,
      selected: profile.activeInterests && profile.activeInterests.includes(name)
    }));
    this.setData({ interestOptions });
  },

  // 昵称
  onNameChange(e) {
    this.setData({ 'profile.name': e.detail.value });
  },

  // 年龄
  onAgeChange(e) {
    this.setData({ 'profile.age': parseInt(e.detail.value) || 0 });
  },

  // 城市
  onCityChange(e) {
    this.setData({ 'profile.city': e.detail.value });
  },

  // 职业
  onOccupationChange(e) {
    this.setData({ 'profile.occupation': e.detail.value });
  },

  // 简介
  onBioChange(e) {
    this.setData({ 'profile.bio': e.detail.value });
  },

  // 兴趣标签
  onInterestTap(e) {
    const tag = e.currentTarget.dataset.tag;
    const { interestOptions } = this.data;

    const option = interestOptions.find(o => o.name === tag);
    if (option) {
      option.selected = !option.selected;
    }

    // 更新 profile.activeInterests
    const activeInterests = interestOptions.filter(o => o.selected).map(o => o.name);

    this.setData({
      interestOptions,
      'profile.activeInterests': activeInterests
    });
  },

  // 添加照片
  onAddPhoto() {
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      success: (res) => {
        const photos = this.data.profile.photos || [];
        res.tempFiles.forEach(file => {
          photos.push(file.tempFilePath);
        });
        this.setData({ 'profile.photos': photos });
      }
    });
  },

  // 保存
  onSave() {
    wx.setStorageSync('profile', this.data.profile);
    wx.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  // 返回
  onBack() {
    wx.navigateBack();
  }
});
