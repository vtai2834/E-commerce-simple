"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const auth = useAuth();
    const user = auth?.user;
    const logout = auth?.logout;
  
  return (
    <nav className="navbar">
      <div>
        <Link href="/">Trang chủ</Link>
        <Link href="/products">Sản phẩm</Link>
        <Link href="/cart">Giỏ hàng</Link>
        <Link href="/orders">Đơn hàng</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Xin chào, <b>{user.fullName}</b></span>
            <button className="btn" onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <Link href="/login">Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
} 