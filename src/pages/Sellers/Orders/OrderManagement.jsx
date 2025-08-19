import React, { useEffect, useState } from "react";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9000/orders?_sort=createdAt&_order=desc")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, newStatus) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    await fetch(`http://localhost:9000/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    });

    setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="order-management">
      <h1>Quản lý đơn hàng</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderCode}</td>
              <td>{o.shippingAddress?.name}</td>
              <td>{o.totalAmount.toLocaleString()} đ</td>
              <td>
                <span className={`status-badge ${o.status?.toLowerCase()}`}>
                  {o.status}
                </span>
              </td>
              <td>{o.paymentStatus}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
