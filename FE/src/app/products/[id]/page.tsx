"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { getProduct } from '../../../lib/api';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const auth = useAuth();
  const cart = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!auth?.user) {
      router.replace("/login");
      return;
    }
  }, [auth?.user, router]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await getProduct(id as string);
      setProduct(res.data);
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Không thể tải thông tin sản phẩm');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      cart.addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl
      });
      alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>Không tìm thấy sản phẩm</p>
        <button 
          className="btn" 
          onClick={() => router.push('/products')}
          style={{ backgroundColor: '#3b82f6' }}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Product Image */}
          <div>
            <img 
              src={product.imageUrl || '/no-image.png'} 
              alt={product.name}
              style={{ 
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 700,
              marginBottom: '16px',
              color: '#1a1a1a'
            }}>
              {product.name}
            </h1>
            
            <p style={{ 
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#4b5563',
              marginBottom: '24px'
            }}>
              {product.description || 'Không có mô tả'}
            </p>

            <div style={{ 
              fontSize: '28px',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '24px'
            }}>
              {product.price.toLocaleString()}₫
            </div>

            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontWeight: 600 }}>Số lượng:</span>
              <button 
                className="btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                style={{ padding: '4px 12px' }}
              >
                -
              </button>
              <span style={{ 
                padding: '4px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px'
              }}>
                {quantity}
              </span>
              <button 
                className="btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                style={{ padding: '4px 12px' }}
              >
                +
              </button>
              <span style={{ color: '#6b7280' }}>
                (Còn {product.stock} sản phẩm)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  backgroundColor: '#2563eb',
                  padding: '12px 24px',
                  fontSize: '16px'
                }}
              >
                {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
              <button 
                className="btn"
                onClick={() => router.push('/products')}
                style={{
                  backgroundColor: '#6b7280',
                  padding: '12px 24px',
                  fontSize: '16px'
                }}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}