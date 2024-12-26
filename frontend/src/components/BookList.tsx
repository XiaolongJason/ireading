import React from 'react';
import { Link } from 'react-router-dom';
import './BookList.css';

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  ageRange: string;
}

const defaultBooks: Book[] = [
  {
    id: '1',
    title: '小红帽',
    author: '格林兄弟',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '一个关于小女孩和大灰狼的经典童话故事。',
    ageRange: '3-6岁'
  },
  {
    id: '2',
    title: '三只小猪',
    author: '约瑟夫·雅各布斯',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '三只小猪建房子的故事教会我们努力工作的重要性。',
    ageRange: '3-6岁'
  },
  {
    id: '3',
    title: '爱丽丝梦游仙境',
    author: '刘易斯·卡罗尔',
    coverImage: 'https://via.placeholder.com/200x300',
    description: '跟随爱丽丝进入一个充满奇幻冒险的世界。',
    ageRange: '6-9岁'
  }
];

const BookList: React.FC = () => {
  return (
    <div className="book-list">
      <h1>儿童绘本列表</h1>
      <div className="books-grid">
        {defaultBooks.map((book) => (
          <Link to={`/book/${book.id}`} key={book.id} className="book-card">
            <img src={book.coverImage} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">作者：{book.author}</p>
              <p className="age-range">适读年龄：{book.ageRange}</p>
              <p className="description">{book.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookList;
