"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../lib/api';

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

export default function ProductManagement() {
  const auth = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  });

  // Check authentication
  useEffect(() => {
    if (!auth?.user) {
      router.replace("/login");
    }
  }, [auth?.user, router]);

  // Load products
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
      alert('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Update product
        await updateProduct(editingProduct._id, formData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        await createProduct(formData);
        alert('Thêm sản phẩm thành công!');
      }
      
      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      setLoading(true);
      await deleteProduct(id);
      alert('Xóa sản phẩm thành công!');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: ''
    });
  };

  const handleLogout = () => {
    auth?.logout();
    router.replace('/login');
  };

  return (
    <div className="container" style={{ maxWidth: 1200, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Quản lý sản phẩm</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="btn" 
            onClick={handleAdd}
            style={{ backgroundColor: '#10b981' }}
          >
            + Thêm sản phẩm
          </button>
          <button 
            className="btn" 
            onClick={() => router.push('/products')}
            style={{ backgroundColor: '#6b7280' }}
          >
            Xem danh sách
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

      {/* Loading */}
      {loading && <div style={{ textAlign: 'center', padding: 20 }}>Đang tải...</div>}

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {products.map((product) => (
          <div className="card" key={product._id} style={{ position: 'relative' }}>
            <img 
              src={product.imageUrl || '/no-image.png'} 
              alt={product.name} 
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} 
            />
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{product.name}</h3>
            <p style={{ color: '#666', marginBottom: 8, fontSize: 14 }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, color: '#2563eb', fontSize: 16 }}>
                {product.price.toLocaleString()}₫
              </span>
              <span style={{ color: '#059669', fontSize: 14 }}>
                Kho: {product.stock}
              </span>
            </div>
            
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn" 
                onClick={() => handleEdit(product)}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#3b82f6', 
                  fontSize: 14, 
                  padding: '8px 12px'
                }}
              >
                Sửa
              </button>
              <button 
                className="btn" 
                onClick={() => handleDelete(product._id)}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#ef4444', 
                  fontSize: 14, 
                  padding: '8px 12px'
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 12,
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Tên sản phẩm *
                </label>
                <input
                  className="auth-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Mô tả
                </label>
                <textarea
                  className="auth-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                    Giá *
                  </label>
                  <input
                    className="auth-input"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                    Số lượng *
                  </label>
                  <input
                    className="auth-input"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  URL hình ảnh
                </label>
                <input
                  className="auth-input"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseModal}
                  style={{ backgroundColor: '#6b7280' }}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{ backgroundColor: '#10b981' }}
                >
                  {loading 
                    ? 'Đang lưu...' 
                    : editingProduct 
                      ? 'Cập nhật' 
                      : 'Thêm mới'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}