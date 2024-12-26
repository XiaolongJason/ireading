import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BookDetail.css';

interface Page {
  content: string;
  image: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  ageRange: string;
  pages: Page[];
}

const defaultBooks: Book[] = [
  {
    id: '1',
    title: '小红帽',
    author: '格林兄弟',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '一个关于小女孩和大灰狼的经典童话故事。这个故事教导孩子们要听从父母的话，不要轻易相信陌生人。',
    ageRange: '3-6岁',
    pages: [
      {
        content: '从前，有一个可爱的小女孩，她总是戴着奶奶送给她的红色帽子，所以大家都叫她小红帽。',
        image: 'https://via.placeholder.com/800x600?text=Page+1'
      },
      {
        content: '有一天，妈妈让小红帽去给生病的奶奶送食物。妈妈叮嘱她要走大路，不要跟陌生人说话。',
        image: 'https://via.placeholder.com/800x600?text=Page+2'
      },
      {
        content: '在森林里，小红帽遇到了一只大灰狼。大灰狼假装很友好，问她要去哪里。',
        image: 'https://via.placeholder.com/800x600?text=Page+3'
      },
      {
        content: '大灰狼知道了奶奶家的位置，它抄近路先到了奶奶家，把奶奶关进了衣柜里。',
        image: 'https://via.placeholder.com/800x600?text=Page+4'
      },
      {
        content: '当小红帽到达时，大灰狼装扮成奶奶的样子。小红帽发现"奶奶"看起来很奇怪。',
        image: 'https://via.placeholder.com/800x600?text=Page+5'
      },
      {
        content: '幸运的是，一个猎人听到了声音，及时赶到救了小红帽和奶奶。从此，小红帽再也不敢不听妈妈的话了。',
        image: 'https://via.placeholder.com/800x600?text=Page+6'
      }
    ]
  },
  {
    id: '2',
    title: '三只小猪',
    author: '约瑟夫·雅各布斯',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '三只小猪建房子的故事教会我们努力工作的重要性。',
    ageRange: '3-6岁',
    pages: [
      {
        content: '从前，有三只小猪兄弟。他们决定离开家，各自建造自己的房子。',
        image: 'https://via.placeholder.com/800x600?text=Page+1'
      },
      {
        content: '老大很懒，用稻草很快就搭建了一座房子。',
        image: 'https://via.placeholder.com/800x600?text=Page+2'
      },
      {
        content: '二哥比老大勤快一些，用木头建了一座房子。',
        image: 'https://via.placeholder.com/800x600?text=Page+3'
      },
      {
        content: '小弟最勤劳，他用砖块认真地建造了一座结实的房子。',
        image: 'https://via.placeholder.com/800x600?text=Page+4'
      },
      {
        content: '大灰狼来了！它轻易就吹倒了稻草房子和木头房子，两只小猪跑到小弟的砖房子里。',
        image: 'https://via.placeholder.com/800x600?text=Page+5'
      },
      {
        content: '大灰狼怎么也吹不倒砖房子。三只小猪在房子里安全地生活着，他们明白了勤劳的重要性。',
        image: 'https://via.placeholder.com/800x600?text=Page+6'
      }
    ]
  },
  {
    id: '3',
    title: '爱丽丝梦游仙境',
    author: '刘易斯·卡罗尔',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '跟随爱丽丝进入一个充满奇幻冒险的世界。',
    ageRange: '6-9岁',
    pages: [
      {
        content: '爱丽丝在树下看书时，看见一只穿着背心的白兔匆匆跑过。',
        image: 'https://via.placeholder.com/800x600?text=Page+1'
      },
      {
        content: '好奇的爱丽丝跟着白兔，掉进了一个深深的兔子洞。',
        image: 'https://via.placeholder.com/800x600?text=Page+2'
      },
      {
        content: '她来到一个神奇的房间，那里有一瓶写着"喝我"的饮料和一块写着"吃我"的蛋糕。',
        image: 'https://via.placeholder.com/800x600?text=Page+3'
      },
      {
        content: '爱丽丝遇到了疯帽匠，和他一起参加了一场疯狂的茶会。',
        image: 'https://via.placeholder.com/800x600?text=Page+4'
      },
      {
        content: '在花园里，她遇到了脾气暴躁的红心女王，女王总是喊"砍掉他的头！"',
        image: 'https://via.placeholder.com/800x600?text=Page+5'
      },
      {
        content: '最后，爱丽丝在树下醒来，发现这一切都是一场奇妙的梦。',
        image: 'https://via.placeholder.com/800x600?text=Page+6'
      }
    ]
  }
];

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const book = defaultBooks.find(b => b.id === id);
  const [currentPage, setCurrentPage] = useState(0);

  if (!book) {
    return (
      <div className="book-detail-error">
        <h2>未找到该图书</h2>
        <Link to="/" className="back-button">返回首页</Link>
      </div>
    );
  }

  const nextPage = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="book-detail">
      <div className="book-info-header">
        <h1>{book.title}</h1>
        <div className="book-meta">
          <p className="author">作者：{book.author}</p>
          <p className="age-range">适读年龄：{book.ageRange}</p>
        </div>
      </div>
      
      <div className="story-content">
        <button 
          className="nav-button prev" 
          onClick={previousPage} 
          disabled={currentPage === 0}
        >
          &#8249;
        </button>

        <div className="page-content">
          <img 
            src={book.pages[currentPage].image} 
            alt={`${book.title} - 第 ${currentPage + 1} 页`} 
          />
          <div className="page-text">
            <p>{book.pages[currentPage].content}</p>
            <div className="page-number">
              第 {currentPage + 1} 页 / 共 {book.pages.length} 页
            </div>
          </div>
        </div>

        <button 
          className="nav-button next" 
          onClick={nextPage} 
          disabled={currentPage === book.pages.length - 1}
        >
          &#8250;
        </button>
      </div>

      <div className="book-actions">
        <Link to="/" className="back-button">返回图书列表</Link>
      </div>
    </div>
  );
};

export default BookDetail;
