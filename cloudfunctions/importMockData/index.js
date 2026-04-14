// cloudfunctions/importMockData/index.js
// 用于将mock数据导入到云数据库

const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// Mock用户数据
const mockUsers = [
  {
    id: 1,
    name: "小雅",
    age: 28,
    city: "北京",
    occupation: "产品经理",
    interests: ["旅行", "美食"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "热爱生活，享受当下",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  },
  {
    id: 2,
    name: "晓敏",
    age: 26,
    city: "上海",
    occupation: "设计师",
    interests: ["摄影", "旅行"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "喜欢用镜头记录美好",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  },
  {
    id: 3,
    name: "静雯",
    age: 29,
    city: "深圳",
    occupation: "市场营销",
    interests: ["瑜伽", "阅读"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    bio: "自律即自由",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  },
  {
    id: 4,
    name: "欣怡",
    age: 27,
    city: "广州",
    occupation: "HR",
    interests: ["跑步", "健身"],
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    bio: "运动是最好的生活",
    isLiked: false,
    likesMe: true,
    createTime: new Date()
  },
  {
    id: 5,
    name: "雨桐",
    age: 25,
    city: "杭州",
    occupation: "教师",
    interests: ["舞蹈", "音乐"],
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    bio: "舞蹈让我快乐",
    isLiked: false,
    likesMe: true,
    createTime: new Date()
  },
  {
    id: 6,
    name: "诗涵",
    age: 24,
    city: "成都",
    occupation: "自由职业",
    interests: ["美食", "电影"],
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    bio: "探索城市的美食地图",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  },
  {
    id: 7,
    name: "梦琪",
    age: 30,
    city: "南京",
    occupation: "工程师",
    interests: ["编程", "游戏"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "技术改变世界",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  },
  {
    id: 8,
    name: "思颖",
    age: 26,
    city: "武汉",
    occupation: "财务",
    interests: ["阅读", "旅行"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    bio: "书中自有黄金屋",
    isLiked: false,
    likesMe: false,
    createTime: new Date()
  }
];

// Mock消息数据
const mockMessages = [
  {
    userId: 1,
    userName: "小雅",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    lastMessage: "晚上一起去吃饭吧",
    time: "18:30",
    unreadCount: 2,
    createTime: new Date()
  },
  {
    userId: 2,
    userName: "晓敏",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    lastMessage: "好的，我知道了",
    time: "昨天",
    unreadCount: 0,
    createTime: new Date()
  },
  {
    userId: 3,
    userName: "静雯",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    lastMessage: "周末有空吗？",
    time: "星期五",
    unreadCount: 1,
    createTime: new Date()
  },
  {
    userId: 4,
    userName: "欣怡",
    userAvatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    lastMessage: "谢谢你的帮助",
    time: "星期四",
    unreadCount: 0,
    createTime: new Date()
  }
];

// Mock聊天记录
const mockChatMessages = [
  {
    senderId: 1,
    receiverId: 0,
    content: "你好呀",
    time: "18:20",
    isSelf: false,
    createTime: new Date()
  },
  {
    senderId: 0,
    receiverId: 1,
    content: "你好，很高兴认识你",
    time: "18:21",
    isSelf: true,
    createTime: new Date()
  },
  {
    senderId: 1,
    receiverId: 0,
    content: "我看你也喜欢旅行",
    time: "18:22",
    isSelf: false,
    createTime: new Date()
  },
  {
    senderId: 0,
    receiverId: 1,
    content: "是的，经常出去玩",
    time: "18:23",
    isSelf: true,
    createTime: new Date()
  },
  {
    senderId: 1,
    receiverId: 0,
    content: "晚上一起去吃饭吧",
    time: "18:30",
    isSelf: false,
    createTime: new Date()
  }
];

// Mock个人资料
const mockProfile = {
  userId: 0,
  name: "张三",
  age: 28,
  city: "北京",
  occupation: "产品经理",
  interests: ["旅行", "美食", "健身", "摄影", "阅读", "音乐", "电影", "运动"],
  activeInterests: ["旅行", "美食", "健身", "摄影"],
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  photos: [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  ],
  bio: "热爱生活，享受当下",
  visitors: 128,
  likes: 42,
  matches: 35,
  createTime: new Date(),
  updateTime: new Date()
};

// 主函数
exports.main = async (event, context) => {
  const { collectionName, action } = event;

  try {
    // 如果没有指定集合名称，导入所有数据
    if (!collectionName || collectionName === 'all') {
      const results = await Promise.all([
        importCollection('users', mockUsers),
        importCollection('messages', mockMessages),
        importCollection('chat_messages', mockChatMessages),
        importCollection('profiles', [mockProfile])
      ]);

      return {
        success: true,
        message: '所有数据导入成功',
        results: {
          users: results[0],
          messages: results[1],
          chat_messages: results[2],
          profiles: results[3]
        }
      };
    }

    // 导入指定集合
    let data = [];
    switch (collectionName) {
      case 'users':
        data = mockUsers;
        break;
      case 'messages':
        data = mockMessages;
        break;
      case 'chat_messages':
        data = mockChatMessages;
        break;
      case 'profiles':
        data = [mockProfile];
        break;
      default:
        return {
          success: false,
          message: `未知的集合名称: ${collectionName}`
        };
    }

    const result = await importCollection(collectionName, data);
    return {
      success: true,
      message: `${collectionName} 数据导入成功`,
      result
    };

  } catch (err) {
    console.error('导入失败:', err);
    return {
      success: false,
      message: '导入失败',
      error: err.message
    };
  }
};

// 导入集合的辅助函数
async function importCollection(collectionName, data) {
  try {
    // 首先尝试创建集合（如果已存在会失败，忽略错误）
    try {
      await db.createCollection(collectionName);
      console.log(`创建集合: ${collectionName}`);
    } catch (createErr) {
      // 集合已存在，忽略错误
      console.log(`集合 ${collectionName} 已存在或创建失败: ${createErr.message}`);
    }

    // 等待一下确保集合创建成功
    await new Promise(resolve => setTimeout(resolve, 500));

    // 尝试清空现有数据
    try {
      const existingData = await db.collection(collectionName).get();
      if (existingData.data.length > 0) {
        console.log(`清空 ${collectionName} 集合中的 ${existingData.data.length} 条数据`);
        // 逐条删除，避免批量删除限制
        const deletePromises = existingData.data.map(item =>
          db.collection(collectionName).doc(item._id).remove()
        );
        await Promise.all(deletePromises);
      }
    } catch (clearErr) {
      console.log(`清空数据失败: ${clearErr.message}`);
    }

    // 批量插入数据
    const batchSize = 20; // 每次最多插入20条
    const totalRecords = data.length;
    let insertedCount = 0;

    for (let i = 0; i < totalRecords; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const tasks = batch.map(item => {
        return db.collection(collectionName).add({
          data: item
        });
      });

      const results = await Promise.all(tasks);
      insertedCount += results.length;
      console.log(`${collectionName}: 已插入 ${insertedCount}/${totalRecords} 条数据`);
    }

    return {
      collectionName,
      totalRecords,
      insertedCount,
      status: 'success'
    };

  } catch (err) {
    console.error(`导入 ${collectionName} 失败:`, err);
    throw err;
  }
}
