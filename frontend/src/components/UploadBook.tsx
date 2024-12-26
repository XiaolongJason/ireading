import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadBook.css';

interface UploadBookProps {
  onUploadSuccess?: () => void;
}

const UploadBook: React.FC<UploadBookProps> = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    ageRange: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('请上传 PDF 文件');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('请选择要上传的 PDF 文件');
      return;
    }

    setIsUploading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('pdf', file);
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    try {
      const response = await fetch('http://localhost:5000/api/books/upload', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传过程中发生错误');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-book">
      <h1>上传新绘本</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">书名</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">作者</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">简介</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ageRange">适读年龄</label>
          <input
            type="text"
            id="ageRange"
            name="ageRange"
            value={formData.ageRange}
            onChange={handleInputChange}
            placeholder="例如：3-6岁"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pdf">PDF 文件</label>
          <input
            type="file"
            id="pdf"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isUploading}
            className={isUploading ? 'loading' : ''}
          >
            {isUploading ? '上传中...' : '上传'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadBook;
