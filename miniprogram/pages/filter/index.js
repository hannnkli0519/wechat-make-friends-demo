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
    interests: mockInterests,
    isReady: false
  },

  onLoad() {
    // 从本地存储加载已保存的筛选条件
    const savedFilter = wx.getStorageSync('filterConfig');
    if (savedFilter) {
      // 确保 cities 和 interests 始终是数组，防止从 storage 读取到旧格式或空数据
      const filter = {
        minAge: savedFilter.minAge || 18,
        maxAge: savedFilter.maxAge || 40,
        cities: Array.isArray(savedFilter.cities) ? savedFilter.cities : [],
        interests: Array.isArray(savedFilter.interests) ? savedFilter.interests : []
      };
      this.setData({ filter });
    }
  },

  onShow() {
    // 页面完全显示并动画结束后再渲染底部固定按钮，彻底解决闪现问题
    setTimeout(() => {
      this.setData({ isReady: true });
    }, 400);
  },

  onHide() {
    // 离开页面时重置状态
    this.setData({ isReady: false });
  },

  onUnload() {
    // 卸载页面时重置状态
    this.setData({ isReady: false });
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
    let cities = [...(this.data.filter.cities || [])];
    
    console.log('点击城市:', city, '当前已选:', cities);

    const index = cities.indexOf(city);
    if (index > -1) {
      cities.splice(index, 1);
    } else {
      cities.push(city);
    }

    this.setData({ 
      'filter.cities': cities 
    }, () => {
      console.log('更新后的城市:', this.data.filter.cities);
    });
  },

  // 兴趣选择
  onInterestTap(e) {
    const tag = e.currentTarget.dataset.tag;
    let interests = [...(this.data.filter.interests || [])];
    
    console.log('点击兴趣:', tag, '当前已选:', interests);

    const index = interests.indexOf(tag);
    if (index > -1) {
      interests.splice(index, 1);
    } else {
      interests.push(tag);
    }

    this.setData({ 
      'filter.interests': interests 
    }, () => {
      console.log('更新后的兴趣:', this.data.filter.interests);
    });
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
