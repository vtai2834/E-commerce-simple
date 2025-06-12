"use client";
import { useEffect, useState } from 'react';
import { getOrders } from '../../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Đang tải...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Lịch sử đơn hàng</h1>
      {orders.length === 0 && <div>Chưa có đơn hàng nào.</div>}
      {orders.map((order: any) => (
        <div className="card" key={order._id}>
          <div style={{ marginBottom: 8 }}><b>Mã đơn:</b> {order._id}</div>
          <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> {order.status}</div>
          <div style={{ marginBottom: 8 }}><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString()}</div>
          <div><b>Sản phẩm:</b>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {order.items.map((p: any, idx: number) => (
                <li key={idx}>{p.name} x {order.items[idx]?.quantity} ({p.price}₫)</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
} 