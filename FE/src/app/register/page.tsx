"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email, password, fullName });
      router.replace('/login');
    } catch (err) {
      setError('Email đã tồn tại hoặc dữ liệu không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-title">Đăng ký</div>
        {error && <div className="auth-error">{error}</div>}
        <input
          className="auth-input"
          placeholder="Họ tên"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        <a className="auth-link" href="/login">
          Đã có tài khoản? Đăng nhập
        </a>
      </form>
    </div>
  );
} 