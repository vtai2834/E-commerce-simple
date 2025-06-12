"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      await cart.checkout();
      alert('Đặt hàng thành công!');
      router.push('/orders');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Giỏ hàng</h1>
        <p style={{ color: '#666', marginBottom: 16 }}>Giỏ hàng trống</p>
        <button 
          className="btn"
          onClick={() => router.push('/products')}
          style={{ backgroundColor: '#3b82f6' }}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Giỏ hàng</h1>
      
      <div className="card" style={{ marginBottom: 24 }}>
        {cart.items.map((item) => (
          <div 
            key={item.productId}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <img 
              src={item.imageUrl || '/no-image.png'} 
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 8,
                marginRight: 16
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{item.name}</h3>
              <p style={{ color: '#2563eb', fontWeight: 600 }}>
                {item.price.toLocaleString()}₫
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn"
                onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                style={{ padding: '4px 12px' }}
              >
                -
              </button>
              <span style={{ minWidth: 40, textAlign: 'center' }}>{item.quantity}</span>
              <button
                className="btn"
                onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                style={{ padding: '4px 12px' }}
              >
                +
              </button>
              <button
                className="btn"
                onClick={() => cart.removeFromCart(item.productId)}
                style={{ 
                  backgroundColor: '#ef4444',
                  padding: '4px 12px',
                  marginLeft: 8
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tổng cộng</h3>
          <p style={{ 
            color: '#2563eb', 
            fontSize: 24, 
            fontWeight: 700 
          }}>
            {cart.totalAmount.toLocaleString()}₫
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn"
            onClick={() => router.push('/products')}
            style={{ backgroundColor: '#6b7280' }}
          >
            Tiếp tục mua sắm
          </button>
          <button
            className="btn"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            style={{ backgroundColor: '#10b981', minWidth: 120 }}
          >
            {isCheckingOut ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>
    </div>
  );
} 