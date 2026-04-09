// utils/mockData.js
// Mock 数据 - 用于本地开发调试

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
    likesMe: false
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
    likesMe: false
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
    likesMe: false
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
    likesMe: true
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
    likesMe: true
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
    likesMe: false
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
    likesMe: false
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
    likesMe: false
  }
];

const mockMessages = [
  {
    userId: 1,
    name: "小雅",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    lastMessage: "晚上一起去吃饭吧",
    time: "18:30",
    unreadCount: 2
  },
  {
    userId: 2,
    name: "晓敏",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    lastMessage: "好的，我知道了",
    time: "昨天",
    unreadCount: 0
  },
  {
    userId: 3,
    name: "静雯",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    lastMessage: "周末有空吗？",
    time: "星期五",
    unreadCount: 1
  },
  {
    userId: 4,
    name: "欣怡",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    lastMessage: "谢谢你的帮助",
    time: "星期四",
    unreadCount: 0
  }
];

const mockChatMessages = [
  {
    id: 1,
    senderId: 1,
    content: "你好呀",
    time: "18:20",
    isSelf: false
  },
  {
    id: 2,
    senderId: 0,
    content: "你好，很高兴认识你",
    time: "18:21",
    isSelf: true
  },
  {
    id: 3,
    senderId: 1,
    content: "我看你也喜欢旅行",
    time: "18:22",
    isSelf: false
  },
  {
    id: 4,
    senderId: 0,
    content: "是的，经常出去玩",
    time: "18:23",
    isSelf: true
  },
  {
    id: 5,
    senderId: 1,
    content: "晚上一起去吃饭吧",
    time: "18:30",
    isSelf: false
  }
];

const mockProfile = {
  id: 0,
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
  matches: 35
};

const mockCities = ["北京", "上海", "深圳", "广州", "杭州", "成都", "南京", "武汉"];
const mockInterests = ["旅行", "美食", "健身", "摄影", "阅读", "音乐", "电影", "运动", "瑜伽", "游戏"];

module.exports = {
  mockUsers,
  mockMessages,
  mockChatMessages,
  mockProfile,
  mockCities,
  mockInterests
};
