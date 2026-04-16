Page({
  data: {
    userList: [],
    loading: false
  },

  onLoad: function () {
    this.loadRecommendations();
  },

  onShow: function() {
    // 检查是否需要显示引导页
    const hasSeenOnboarding = wx.getStorageSync('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      wx.reLaunch({
        url: '/pages/onboarding/index'
      });
      return;
    }

    // 检查筛选条件是否有变化，如果有变化则重新加载
    const savedFilter = wx.getStorageSync('filterConfig');
    const currentFilterStr = JSON.stringify(this.data.lastFilter || {});
    const savedFilterStr = JSON.stringify(savedFilter || {});
    
    if (this.data.userList.length === 0 || currentFilterStr !== savedFilterStr) {
      this.loadRecommendations();
    }
  },

  loadRecommendations: function() {
    var that = this;
    const filter = wx.getStorageSync('filterConfig') || {};
    
    this.setData({ 
      loading: true,
      lastFilter: filter // 记录当前的筛选条件
    });
    
    wx.cloud.callFunction({
      name: 'getRecommendations',
      data: {
        filter: filter
      },
      success: function(res) {
        console.log('获取推荐列表成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            userList: res.result.data || [],
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

  onLikeTap: function (e) {
    var userId = e.currentTarget.dataset.id;
    var that = this;
    
    console.log('点击喜欢，用户ID:', userId);
    
    wx.cloud.callFunction({
      name: 'likeUser',
      data: {
        targetId: userId
      },
      success: function(res) {
        console.log('喜欢成功:', res.result);
        
        if (res.result.code === 0) {
          // 从列表中移除该用户
          var newList = that.data.userList.filter(function(user) {
            return user._id !== userId;
          });
          
          that.setData({
            userList: newList
          });
          
          // 显示提示
          if (res.result.data && res.result.data.isMatched) {
            wx.showToast({ title: '匹配成功！', icon: 'success' });
          } else {
            wx.showToast({ title: '已添加到我喜欢的', icon: 'success' });
          }
        } else {
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      },
      fail: function(err) {
        console.error('喜欢失败:', err);
        wx.showToast({ title: '操作失败', icon: 'none' });
      }
    });
  },

  onSkipTap: function (e) {
    var userId = e.currentTarget.dataset.id;
    
    // 从列表中移除该用户
    var newList = this.data.userList.filter(function(user) {
      return user._id !== userId;
    });
    
    this.setData({
      userList: newList
    });
    
    wx.showToast({ title: '已跳过', icon: 'none' });
  },

  onFilterTap: function () {
    wx.navigateTo({ url: '/pages/filter/index' });
  },

  onSwiperChange: function(e) {
    const { current } = e.detail;
    const { userindex } = e.currentTarget.dataset;
    const key = `userList[${userindex}].currentPhotoIndex`;
    this.setData({
      [key]: current || 0
    });
  }
});