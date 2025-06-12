"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrder } from '../../../lib/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrder(id as string);
      setOrder(res.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (!order) return <div className="container">Không tìm thấy đơn hàng</div>;

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card">
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Chi tiết đơn hàng</h2>
        <div style={{ marginBottom: 8 }}><b>Mã đơn:</b> {order._id}</div>
        <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> {order.status}</div>
        <div style={{ marginBottom: 8 }}><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString()}</div>
        <div><b>Sản phẩm:</b>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {order.productsInfo?.map((p: any, idx: number) => (
              <li key={idx}>{p.name} x {order.items[idx]?.quantity} ({p.price}₫)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 