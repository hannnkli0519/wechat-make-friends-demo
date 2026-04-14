// pages/profile-edit/index.js
Page({
  data: {
    profile: {},
    interestOptions: [
      { name: '旅行', selected: false },
      { name: '美食', selected: false },
      { name: '摄影', selected: false },
      { name: '瑜伽', selected: false },
      { name: '阅读', selected: false },
      { name: '跑步', selected: false },
      { name: '健身', selected: false },
      { name: '舞蹈', selected: false },
      { name: '音乐', selected: false },
      { name: '电影', selected: false },
      { name: '编程', selected: false },
      { name: '游戏', selected: false }
    ],
    loading: false
  },

  onLoad() {
    this.loadProfile();
  },

  loadProfile() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getUserProfile',
      success: function(res) {
        if (res.result.code === 0) {
          const profile = res.result.data;
          that.setData({ profile });

          // 更新兴趣选项的选中状态
          const interestOptions = that.data.interestOptions.map(option => ({
            ...option,
            selected: profile.interests && profile.interests.includes(option.name)
          }));
          
          that.setData({ interestOptions, loading: false });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
          that.setData({ loading: false });
        }
      },
      fail: function(err) {
        console.error('获取个人资料失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ loading: false });
      }
    });
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

    // 更新 profile.interests
    const interests = interestOptions.filter(o => o.selected).map(o => o.name);

    this.setData({
      interestOptions,
      'profile.interests': interests
    });
  },

  // 添加照片
  onAddPhoto() {
    var that = this;
    
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      success: (res) => {
        const photos = that.data.profile.photos || [];
        res.tempFiles.forEach(file => {
          photos.push(file.tempFilePath);
        });
        that.setData({ 'profile.photos': photos });
      }
    });
  },

  // 保存
  onSave() {
    var that = this;
    const { profile } = this.data;

    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'updateUserProfile',
      data: {
        name: profile.name,
        age: profile.age,
        city: profile.city,
        occupation: profile.occupation,
        bio: profile.bio,
        interests: profile.interests,
        photos: profile.photos
      },
      success: function(res) {
        if (res.result.code === 0) {
          wx.showToast({ title: '保存成功', icon: 'success' });
          that.setData({ loading: false });

          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
          that.setData({ loading: false });
        }
      },
      fail: function(err) {
        console.error('保存失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ loading: false });
      }
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  }
});