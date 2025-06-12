"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const cart = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.replace("/login");
    }
  }, [auth?.user, router]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    try {
      cart.addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl
      });
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleLogout = () => {
    auth?.logout();
    router.replace('/login');
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>Đang tải...</div>;
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Danh sách món ăn</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="btn" 
            onClick={() => router.push('/cart')}
            style={{ backgroundColor: '#3b82f6' }}
          >
            Giỏ hàng ({cart.items.length})
          </button>
          <button 
            className="btn" 
            onClick={() => router.push('/products/manage')}
            style={{ backgroundColor: '#10b981' }}
          >
            Quản lý sản phẩm
          </button>
          <button 
            className="btn" 
            onClick={handleLogout}
            style={{ backgroundColor: '#ef4444' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px 0', 
          color: '#666' 
        }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Chưa có sản phẩm nào</p>
          <button 
            className="btn" 
            onClick={() => router.push('/products/manage')}
            style={{ backgroundColor: '#10b981' }}
          >
            Thêm sản phẩm đầu tiên
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 24 
        }}>
          {products.map((product) => (
            <div 
              className="card" 
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              style={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <img 
                src={product.imageUrl || '/no-image.png'} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: 200, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  marginBottom: 12
                }} 
              />
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                margin: '0 0 8px',
                lineHeight: 1.3
              }}>
                {product.name}
              </h2>
              <div style={{ 
                color: '#666', 
                marginBottom: 12,
                fontSize: 14,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.description || 'Không có mô tả'}
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 12
              }}>
                <span style={{ 
                  fontWeight: 700, 
                  color: '#2563eb', 
                  fontSize: 18 
                }}>
                  {product.price.toLocaleString()}₫
                </span>
                <span style={{ 
                  color: product.stock > 0 ? '#059669' : '#ef4444',
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                </span>
              </div>
              <button 
                className="btn"
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stock === 0}
                style={{
                  width: '100%',
                  backgroundColor: product.stock > 0 ? '#2563eb' : '#9ca3af',
                  cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}