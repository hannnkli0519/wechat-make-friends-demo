// pages/filter/index.js
const { mockCities, mockInterests } = require('../../utils/mockData');

Page({
  data: {
    filter: {
      minAge: 18,
      maxAge: 40,
      cities: [],
      interests: []
    },
    cities: mockCities,
    interests: mockInterests
  },

  onLoad() {
    // 从本地存储加载已保存的筛选条件
    const savedFilter = wx.getStorageSync('filterConfig');
    if (savedFilter) {
      this.setData({ filter: savedFilter });
    }
  },

  // 最小年龄
  onMinAgeChange(e) {
    const value = parseInt(e.detail.value);
    this.setData({ 'filter.minAge': value });
  },

  // 最大年龄
  onMaxAgeChange(e) {
    const value = parseInt(e.detail.value);
    this.setData({ 'filter.maxAge': value });
  },

  // 城市选择
  onCityTap(e) {
    const city = e.currentTarget.dataset.city;
    const { cities } = this.data.filter;

    const index = cities.indexOf(city);
    if (index > -1) {
      cities.splice(index, 1);
    } else {
      cities.push(city);
    }

    this.setData({ 'filter.cities': cities });
  },

  // 兴趣选择
  onInterestTap(e) {
    const tag = e.currentTarget.dataset.tag;
    const { interests } = this.data.filter;

    const index = interests.indexOf(tag);
    if (index > -1) {
      interests.splice(index, 1);
    } else {
      interests.push(tag);
    }

    this.setData({ 'filter.interests': interests });
  },

  // 确认筛选
  onConfirm() {
    // 保存筛选条件
    wx.setStorageSync('filterConfig', this.data.filter);

    // 返回首页
    wx.switchTab({
      url: '/pages/home/index'
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  }
});
