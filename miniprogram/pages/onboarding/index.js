// pages/onboarding/index.js
Page({
  data: {
    currentStep: 0,
    disableSwipe: true, // 禁止手动滑动
    loading: false,
    isValid: false,
    profile: {
      name: '',
      age: '',
      city: '',
      occupation: '',
      bio: '',
      photos: [],
      interests: []
    },
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
    ]
  },

  onLoad() {
    // 初始化时也可以尝试获取一次，看是否有基础数据
    this.checkValidation();
  },

  // 监听滑动（虽然禁止了手动滑动，但通过 current 控制时也会触发）
  onSwiperChange(e) {
    this.setData({ currentStep: e.detail.current });
  },

  nextStep() {
    this.setData({ currentStep: this.data.currentStep + 1 });
  },

  // --- 表单处理逻辑（复用 profile-edit） ---
  
  onNameChange(e) {
    this.setData({ 'profile.name': e.detail.value }, this.checkValidation);
  },

  onAgeChange(e) {
    this.setData({ 'profile.age': parseInt(e.detail.value) || '' }, this.checkValidation);
  },

  onCityChange(e) {
    this.setData({ 'profile.city': e.detail.value }, this.checkValidation);
  },

  onOccupationChange(e) {
    this.setData({ 'profile.occupation': e.detail.value }, this.checkValidation);
  },

  onBioChange(e) {
    this.setData({ 'profile.bio': e.detail.value }, this.checkValidation);
  },

  onInterestTap(e) {
    const tag = e.currentTarget.dataset.tag;
    const { interestOptions } = this.data;
    const option = interestOptions.find(o => o.name === tag);
    if (option) {
      option.selected = !option.selected;
    }
    const interests = interestOptions.filter(o => o.selected).map(o => o.name);
    this.setData({ interestOptions, 'profile.interests': interests }, this.checkValidation);
  },

  onAddPhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const photos = this.data.profile.photos || [];
        res.tempFiles.forEach(file => photos.push(file.tempFilePath));
        this.setData({ 'profile.photos': photos }, this.checkValidation);
      }
    });
  },

  onDeletePhoto(e) {
    const { index } = e.currentTarget.dataset;
    const { photos } = this.data.profile;
    photos.splice(index, 1);
    this.setData({ 'profile.photos': photos }, this.checkValidation);
  },

  // 表单校验
  checkValidation() {
    const { profile } = this.data;
    const isValid = !!(
      profile.name && 
      profile.age && 
      profile.city && 
      profile.occupation && 
      profile.photos.length > 0
    );
    this.setData({ isValid });
  },

  // 保存资料并进入下一步
  async saveProfile() {
    if (!this.data.isValid) {
      wx.showToast({ title: '请完善必填信息', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    const { profile } = this.data;

    try {
      // 1. 上传照片
      const uploadPhotos = [];
      for (const path of profile.photos) {
        const cloudPath = `user-photos/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath,
          filePath: path
        });
        uploadPhotos.push(uploadRes.fileID);
      }

      // 2. 调用云函数更新
      const res = await wx.cloud.callFunction({
        name: 'updateUserProfile',
        data: {
          ...profile,
          photos: uploadPhotos,
          avatar: uploadPhotos[0]
        }
      });

      if (res.result.code === 0) {
        this.setData({ loading: false, currentStep: 3 });
      } else {
        throw new Error(res.result.message);
      }
    } catch (err) {
      console.error('保存失败:', err);
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  finishOnboarding() {
    // 标记已完成引导
    wx.setStorageSync('hasSeenOnboarding', true);
    wx.switchTab({
      url: '/pages/home/index'
    });
  }
});
