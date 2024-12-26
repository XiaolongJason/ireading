const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultBooks = [
  {
    title: '小红帽',
    author: '格林兄弟',
    description: '一个关于小女孩和大灰狼的经典童话故事',
    ageRange: '3-8岁',
    coverImage: '/images/little-red-riding-hood-cover.jpg',
    pages: [
      {
        pageNumber: 1,
        image: '/images/little-red-riding-hood-1.jpg',
        content: '从前，有一个可爱的小女孩，她总是戴着奶奶送给她的红色帽子，所以大家都叫她小红帽。'
      },
      {
        pageNumber: 2,
        image: '/images/little-red-riding-hood-2.jpg',
        content: '有一天，妈妈让小红帽去给生病的奶奶送食物。妈妈叮嘱她要小心，不要偏离道路。'
      },
      {
        pageNumber: 3,
        image: '/images/little-red-riding-hood-3.jpg',
        content: '在森林里，小红帽遇到了一只大灰狼。大灰狼问她要去哪里，小红帽告诉了它。'
      }
    ]
  },
  {
    title: '三只小猪',
    author: '约瑟夫·雅各布斯',
    description: '讲述三只小猪建房子的智慧故事',
    ageRange: '4-9岁',
    coverImage: '/images/three-little-pigs-cover.jpg',
    pages: [
      {
        pageNumber: 1,
        image: '/images/three-little-pigs-1.jpg',
        content: '从前有三只小猪，他们决定离开家去盖自己的房子。'
      },
      {
        pageNumber: 2,
        image: '/images/three-little-pigs-2.jpg',
        content: '大哥用稻草盖了一座房子，很快就完工了。二哥用木头盖了一座房子，也很快完成了。'
      },
      {
        pageNumber: 3,
        image: '/images/three-little-pigs-3.jpg',
        content: '小弟用砖头盖房子，虽然慢但是很结实。'
      }
    ]
  },
  {
    title: '爱丽丝梦游仙境',
    author: '刘易斯·卡罗尔',
    description: '一个充满奇思妙想的梦幻故事',
    ageRange: '6-12岁',
    coverImage: '/images/alice-cover.jpg',
    pages: [
      {
        pageNumber: 1,
        image: '/images/alice-1.jpg',
        content: '爱丽丝坐在河边感到很无聊，突然看见一只白兔匆匆跑过。'
      },
      {
        pageNumber: 2,
        image: '/images/alice-2.jpg',
        content: '爱丽丝跟着白兔跳进了兔子洞，掉入了一个奇妙的世界。'
      },
      {
        pageNumber: 3,
        image: '/images/alice-3.jpg',
        content: '在这个世界里，爱丽丝遇到了许多奇怪的生物和有趣的事情。'
      }
    ]
  }
];

async function main() {
  console.log('开始填充默认数据...');

  for (const book of defaultBooks) {
    const { pages, ...bookData } = book;
    
    try {
      const createdBook = await prisma.book.create({
        data: {
          ...bookData,
          pages: {
            create: pages
          }
        },
        include: {
          pages: true
        }
      });
      
      console.log(`创建图书成功: ${createdBook.title}`);
    } catch (error) {
      console.error(`创建图书失败: ${book.title}`, error);
    }
  }

  console.log('数据填充完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
