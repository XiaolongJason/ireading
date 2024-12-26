import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">儿童绘本阅读</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">首页</Link>
        <Link to="/upload" className="nav-link">上传绘本</Link>
        <Link to="/login" className="nav-link">登录</Link>
        <Link to="/register" className="nav-link">注册</Link>
      </div>
    </nav>
  );
};

export default Navbar;
