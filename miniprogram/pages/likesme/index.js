// pages/likesme/index.js
Page({
  data: {
    likesMeList: [],
    loading: false
  },

  onShow() {
    this.loadLikesMe();
  },

  loadLikesMe() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getMatches',
      success: function(res) {
        console.log('获取喜欢我的列表成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            likesMeList: res.result.data || [],
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

  // 回应喜欢
  onRespondTap(e) {
    const userId = e.currentTarget.dataset.id;
    const userName = e.currentTarget.dataset.name;
    var that = this;

    wx.cloud.callFunction({
      name: 'respondLike',
      data: {
        targetId: userId,
        targetName: userName
      },
      success: function(res) {
        if (res.result.code === 0) {
          // 从列表中移除
          const newList = that.data.likesMeList.filter(u => u._id !== userId);
          that.setData({ 
            likesMeList: newList 
          });

          // 显示匹配成功提示
          wx.showModal({
            title: '匹配成功',
            content: `已与 ${userName} 匹配成功！可以在消息页面开始聊天了`,
            showCancel: false,
            confirmText: '去聊天',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.switchTab({
                  url: '/pages/messages/index'
                });
              }
            }
          });
        } else {
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      },
      fail: function(err) {
        console.error('回应喜欢失败:', err);
        wx.showToast({ title: '操作失败', icon: 'none' });
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
});